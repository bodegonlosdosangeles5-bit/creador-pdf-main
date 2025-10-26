export interface InventoryRow {
  id: string;
  lote: string;
  producto: string;
  cantidad: number;
  unidad: string;
  observaciones: string;
}

export interface PettyCashRow {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  ingreso: number;
  egreso: number;
  saldo: number;
  nota: string;
}

export interface AutoExpensesRow {
  id: string;
  fecha: string;
  tipo: string;
  monto: number;
  nota: string;
  recibos?: File[]; // Archivos de imágenes adjuntos
}

export type DataMode = "inventory" | "pettycash" | "autoexpenses";
