import { useState, useMemo } from "react";
import { Plus, Trash2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { PettyCashRow } from "@/types";
import { generatePettyCashPDF } from "@/utils/pdfGenerator";

interface PettyCashTableProps {
  onBack: () => void;
}

export const PettyCashTable = ({ onBack }: PettyCashTableProps) => {
  const [rows, setRows] = useState<PettyCashRow[]>([
    { 
      id: "1", 
      fecha: new Date().toLocaleDateString("es-AR"), 
      concepto: "", 
      categoria: "", 
      ingreso: 0, 
      egreso: 0, 
      saldo: 0, 
      nota: "" 
    },
  ]);
  const [title, setTitle] = useState("Caja Chica");
  const [subtitle, setSubtitle] = useState("");

  // Recalculate balances whenever rows change
  const rowsWithSaldo = useMemo(() => {
    let runningBalance = 0;
    return rows.map((row) => {
      runningBalance += (row.ingreso || 0) - (row.egreso || 0);
      return { ...row, saldo: runningBalance };
    });
  }, [rows]);

  const addRow = () => {
    setRows([
      ...rows,
      { 
        id: Date.now().toString(), 
        fecha: new Date().toLocaleDateString("es-AR"), 
        concepto: "", 
        categoria: "", 
        ingreso: 0, 
        egreso: 0, 
        saldo: 0, // Will be calculated by useMemo
        nota: "" 
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof PettyCashRow, value: string | number) => {
    setRows(prevRows => 
      prevRows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handlePreview = () => {
    generatePettyCashPDF(rowsWithSaldo, title, subtitle, true);
  };

  const handleDownload = () => {
    generatePettyCashPDF(rowsWithSaldo, title, subtitle, false);
  };

  const totalIngreso = rows.reduce((sum, row) => sum + (row.ingreso || 0), 0);
  const totalEgreso = rows.reduce((sum, row) => sum + (row.egreso || 0), 0);
  const saldoFinal = rowsWithSaldo.length > 0 ? rowsWithSaldo[rowsWithSaldo.length - 1].saldo : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <ThemeToggle position="center" />
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Gestión de Caja Chica
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Registrá movimientos y exportá a PDF A4
            </p>
          </div>
          <Button onClick={onBack} variant="outline" className="w-full sm:w-auto">
            Volver
          </Button>
        </div>

        {/* Title input */}
        <Card className="p-6 md:p-8">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Título del documento *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Caja Chica - Octubre 2025"
              className="input-field"
            />
          </div>
        </Card>

        {/* Table */}
        <Card className="p-6 md:p-8">
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[15%]">Fecha</th>
                  <th className="w-[25%]">Concepto</th>
                  <th className="w-[15%]">Ingreso</th>
                  <th className="w-[15%]">Egreso</th>
                  <th className="w-[15%]">Saldo</th>
                  <th className="w-[12%]">Nota</th>
                  <th className="w-[3%]"></th>
                </tr>
              </thead>
              <tbody>
                {rowsWithSaldo.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <Input
                        type="text"
                        value={row.fecha}
                        onChange={(e) => updateRow(row.id, "fecha", e.target.value)}
                        placeholder="DD/MM/AAAA"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Input
                        value={row.concepto}
                        onChange={(e) => updateRow(row.id, "concepto", e.target.value)}
                        placeholder="Descripción"
                        className="input-field"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.ingreso || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateRow(row.id, "ingreso", val === "" ? 0 : parseFloat(val) || 0);
                        }}
                        placeholder="$ 0,00"
                        className="input-field text-right"
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        value={row.egreso || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateRow(row.id, "egreso", val === "" ? 0 : parseFloat(val) || 0);
                        }}
                        placeholder="$ 0,00"
                        className="input-field text-right"
                      />
                    </td>
                    <td className="text-right font-semibold">
                      $ {row.saldo.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <Input
                        value={row.nota}
                        onChange={(e) => updateRow(row.id, "nota", e.target.value)}
                        placeholder="Nota"
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
                  <td colSpan={2} className="text-right">Totales:</td>
                  <td className="text-right">$ {totalIngreso.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="text-right">$ {totalEgreso.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="text-right">$ {saldoFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td colSpan={2}></td>
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
