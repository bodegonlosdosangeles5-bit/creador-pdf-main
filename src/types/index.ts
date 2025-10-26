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
  descripcion: string;
  monto: number;
  kilometraje: string;
  nota: string;
}

export type DataMode = "inventory" | "pettycash";
