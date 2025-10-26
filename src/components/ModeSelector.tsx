import { Package, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ModeSelectorProps {
  onSelectMode: (mode: "inventory" | "pettycash") => void;
}

export const ModeSelector = ({ onSelectMode }: ModeSelectorProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Creador de PDF
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Seleccioná el tipo de documento que querés gestionar
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          <Card
            onClick={() => onSelectMode("inventory")}
            className="card-elevated cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Package className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                  GENERADOR DE REPORTE
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Gestioná lotes, productos y cantidades con exportación a PDF profesional
                </p>
              </div>
            </div>
          </Card>

          <Card
            onClick={() => onSelectMode("pettycash")}
            className="card-elevated cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                <Wallet className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
              </div>
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2">
                  Caja Chica
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Registrá ingresos, egresos y controlá el saldo automáticamente
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
