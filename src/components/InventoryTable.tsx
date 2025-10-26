import { useState } from "react";
import { Plus, Trash2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { InventoryRow } from "@/types";
import { generateInventoryPDF } from "@/utils/pdfGenerator";

interface InventoryTableProps {
  onBack: () => void;
}

export const InventoryTable = ({ onBack }: InventoryTableProps) => {
  const [rows, setRows] = useState<InventoryRow[]>([
    { id: "1", lote: "", producto: "", cantidad: 0, unidad: "", observaciones: "" },
  ]);
  const [title, setTitle] = useState("Inventario General");
  const [subtitle, setSubtitle] = useState("");

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now().toString(), lote: "", producto: "", cantidad: 0, unidad: "", observaciones: "" },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof InventoryRow, value: string | number) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handlePreview = () => {
    generateInventoryPDF(rows, title, subtitle, true);
  };

  const handleDownload = () => {
    generateInventoryPDF(rows, title, subtitle, false);
  };

  const totalCantidad = rows.reduce((sum, row) => sum + (row.cantidad || 0), 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              GENERADOR DE REPORTE
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Cargá los datos y exportá a PDF A4
            </p>
          </div>
          <Button onClick={onBack} variant="outline" className="w-full sm:w-auto">
            Volver
          </Button>
        </div>

        {/* Title input */}
        <Card className="p-4 md:p-6">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título del documento *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Inventario General - Octubre 2025"
              className="input-field"
            />
          </div>
        </Card>

        {/* Table */}
        <Card className="p-4 md:p-6">
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[15%]">Lote</th>
                  <th className="w-[30%]">Producto</th>
                  <th className="w-[15%]">Cantidad</th>
                  <th className="w-[15%]">Unidad</th>
                  <th className="w-[20%]">Faltante</th>
                  <th className="w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Input
                        value={row.lote}
                        onChange={(e) => updateRow(row.id, "lote", e.target.value)}
                        placeholder="L001"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.producto}
                        onChange={(e) => updateRow(row.id, "producto", e.target.value)}
                        placeholder="Nombre del producto"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.cantidad || ""}
                        onChange={(e) => updateRow(row.id, "cantidad", parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="input-field text-right"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.unidad}
                        onChange={(e) => updateRow(row.id, "unidad", e.target.value)}
                        placeholder="Kg, Un, Lt"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.observaciones}
                        onChange={(e) => updateRow(row.id, "observaciones", e.target.value)}
                        placeholder="Faltante"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Button
                        onClick={() => removeRow(row.id)}
                        variant="ghost"
                        size="icon"
                        disabled={rows.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-muted">
                  <td colSpan={2} className="text-right">Total:</td>
                  <td className="text-right">{totalCantidad.toLocaleString("es-AR")}</td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-6">
            <Button onClick={addRow} className="btn-outline w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Agregar fila
            </Button>
            <Button onClick={handlePreview} className="btn-primary w-full sm:w-auto">
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Vista previa A4</span>
              <span className="sm:hidden">Vista previa</span>
            </Button>
            <Button onClick={handleDownload} className="btn-secondary w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
