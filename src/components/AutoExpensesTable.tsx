import { useState, useEffect } from "react";
import { Plus, Trash2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { AutoExpensesRow } from "@/types";
import { generateAutoExpensesPDF } from "@/utils/pdfGenerator";

interface AutoExpensesTableProps {
  onBack: () => void;
}

export const AutoExpensesTable = ({ onBack }: AutoExpensesTableProps) => {
  const [rows, setRows] = useState<AutoExpensesRow[]>([
    { id: "1", fecha: new Date().toISOString().split('T')[0], tipo: "combustible", descripcion: "", monto: 0, kilometraje: "", nota: "" },
  ]);
  const [title, setTitle] = useState("Gastos del Auto");
  const [subtitle, setSubtitle] = useState("");

  // Limpiar cualquier select abierto al desmontar
  useEffect(() => {
    return () => {
      // Force close any open selects
      const selects = document.querySelectorAll('[data-radix-popper-content-wrapper]');
      selects.forEach(select => {
        const parent = select.parentElement;
        if (parent && parent.parentElement) {
          try {
            parent.parentElement.removeChild(parent);
          } catch (e) {
            // Ignorar errores de limpieza
          }
        }
      });
    };
  }, []);

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now().toString(), fecha: new Date().toISOString().split('T')[0], tipo: "combustible", descripcion: "", monto: 0, kilometraje: "", nota: "" },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof AutoExpensesRow, value: string | number) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handlePreview = () => {
    generateAutoExpensesPDF(rows, title, subtitle, true);
  };

  const handleDownload = () => {
    generateAutoExpensesPDF(rows, title, subtitle, false);
  };

  const totalMonto = rows.reduce((sum, row) => sum + (row.monto || 0), 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Gestión de Gastos del Auto
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Cargá los gastos y exportá a PDF A4
            </p>
          </div>
          <Button onClick={onBack} variant="outline" className="w-full sm:w-auto">
            Volver
          </Button>
        </div>

        {/* Title inputs */}
        <Card className="p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Título del documento *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Gastos del Auto - Octubre 2025"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Subtítulo (opcional)
              </label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ej: Vehículo Patente ABC123"
                className="input-field"
              />
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="p-4 md:p-6">
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[12%]">Fecha</th>
                  <th className="w-[15%]">Tipo de Gasto</th>
                  <th className="w-[25%]">Descripción</th>
                  <th className="w-[13%]">Monto</th>
                  <th className="w-[12%]">Kilometraje</th>
                  <th className="w-[18%]">Nota</th>
                  <th className="w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Input
                        type="date"
                        value={row.fecha}
                        onChange={(e) => updateRow(row.id, "fecha", e.target.value)}
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Select
                        value={row.tipo}
                        onValueChange={(value) => updateRow(row.id, "tipo", value)}
                        modal={false}
                      >
                        <SelectTrigger className="input-field">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent modal={false} className="z-[100]">
                          <SelectItem value="combustible">Combustible</SelectItem>
                          <SelectItem value="seguro">Seguro</SelectItem>
                          <SelectItem value="peaje">Peaje</SelectItem>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="estacionamiento">Estacionamiento</SelectItem>
                          <SelectItem value="lavado">Lavado</SelectItem>
                          <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td>
                      <Input
                        value={row.descripcion}
                        onChange={(e) => updateRow(row.id, "descripcion", e.target.value)}
                        placeholder="Detalle del gasto"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.monto || ""}
                        onChange={(e) => updateRow(row.id, "monto", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="input-field text-right"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.kilometraje}
                        onChange={(e) => updateRow(row.id, "kilometraje", e.target.value)}
                        placeholder="Km"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.nota}
                        onChange={(e) => updateRow(row.id, "nota", e.target.value)}
                        placeholder="Nota adicional"
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
                  <td colSpan={3} className="text-right">Total:</td>
                  <td className="text-right">$ {totalMonto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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