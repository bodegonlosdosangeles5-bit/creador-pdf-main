import { useState, useRef } from "react";
import { Plus, Trash2, Download, Eye, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { AutoExpensesRow } from "@/types";
import { generateAutoExpensesPDF } from "@/utils/pdfGenerator";

interface AutoExpensesTableProps {
  onBack: () => void;
}

export const AutoExpensesTable = ({ onBack }: AutoExpensesTableProps) => {
  const [rows, setRows] = useState<AutoExpensesRow[]>([
    { id: "1", fecha: new Date().toISOString().split('T')[0], tipo: "combustible", monto: 0, nota: "", recibos: [] },
  ]);
  const [title, setTitle] = useState("Gastos del Auto");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now().toString(), fecha: new Date().toISOString().split('T')[0], tipo: "combustible", monto: 0, nota: "", recibos: [] },
    ]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof AutoExpensesRow, value: string | number | File[]) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const openDialog = (rowId: string) => {
    setEditingRowId(rowId);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingRowId(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingRowId && event.target.files) {
      const files = Array.from(event.target.files);
      const currentRow = rows.find(r => r.id === editingRowId);
      const existingRecibos = currentRow?.recibos || [];
      const newRecibos = [...existingRecibos, ...files];
      updateRow(editingRowId, "recibos", newRecibos);
    }
  };

  const removeReceipt = (rowId: string, index: number) => {
    const currentRow = rows.find(r => r.id === rowId);
    if (currentRow && currentRow.recibos) {
      const updatedRecibos = currentRow.recibos.filter((_, i) => i !== index);
      updateRow(rowId, "recibos", updatedRecibos);
    }
  };

  const handlePreview = async () => {
    await generateAutoExpensesPDF(rows, title, "", true);
  };

  const handleDownload = async () => {
    await generateAutoExpensesPDF(rows, title, "", false);
  };

  const totalMonto = rows.reduce((sum, row) => sum + (row.monto || 0), 0);

  const currentEditingRow = editingRowId ? rows.find(r => r.id === editingRowId) : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <ThemeToggle position="center" />
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
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

        {/* Title input */}
        <Card className="p-6 md:p-8 space-y-4">
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
        </Card>

        {/* Table */}
        <Card className="p-6 md:p-8">
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[15%]">Fecha</th>
                  <th className="w-[20%]">Tipo de Gasto</th>
                  <th className="w-[15%]">Monto</th>
                  <th className="w-[25%]">Recibos</th>
                  <th className="w-[20%]">Nota</th>
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
                      <select
                        value={row.tipo}
                        onChange={(e) => updateRow(row.id, "tipo", e.target.value)}
                        className="input-field"
                      >
                        <option value="peaje">Peaje</option>
                        <option value="combustible">Combustible</option>
                        <option value="seguro">Seguro</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="estacionamiento">Estacionamiento</option>
                        <option value="lavado">Lavado</option>
                        <option value="otros">Otros</option>
                      </select>
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
                      <Button
                        onClick={() => openDialog(row.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {row.recibos && row.recibos.length > 0 ? `${row.recibos.length} archivos` : "Adjuntar"}
                      </Button>
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

      {/* Dialog para adjuntar recibos */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adjuntar Recibos</DialogTitle>
            <DialogDescription>
              Subí imágenes o archivos PDF de tickets, facturas o comprobantes para este gasto.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Input para subir archivos */}
            <div>
              <Label htmlFor="file-upload">Seleccionar archivos (imágenes o PDFs)</Label>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileSelect}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Puedes seleccionar múltiples archivos a la vez. Se aceptan imágenes y archivos PDF.
              </p>
            </div>

            {/* Vista previa de archivos adjuntos */}
            <div>
              <p className="text-sm font-medium mb-4">Archivos ({currentEditingRow?.recibos?.length || 0})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {currentEditingRow?.recibos?.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (file.type === 'application/pdf' || 
                            file.type === 'application/x-pdf' ||
                            file.name.toLowerCase().endsWith('.pdf')) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                          <FileIcon className="w-12 h-12 text-red-500 mb-2" />
                          <span className="text-xs font-medium text-foreground">PDF</span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <button
                        onClick={() => removeReceipt(currentEditingRow.id, index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {(!currentEditingRow?.recibos || currentEditingRow.recibos.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay recibos adjuntos todavía
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={closeDialog}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const FileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);