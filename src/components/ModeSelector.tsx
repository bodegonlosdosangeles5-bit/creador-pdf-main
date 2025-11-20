import { FileText, Wallet, Car } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/FeatureCard";

interface ModeSelectorProps {
  onSelectMode: (mode: "inventory" | "pettycash" | "autoexpenses") => void;
}

export const ModeSelector = ({ onSelectMode }: ModeSelectorProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] relative overflow-hidden transition-colors duration-300">
      {/* Fondo con movimiento sutil para profundidad */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transform-gpu will-change-transform"
        style={{ perspective: 1000 }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-5xl">
          <motion.div 
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[color:var(--text)] mb-4">
              Creador de PDF
            </h1>
            <p className="text-[color:var(--text-muted)] text-base md:text-lg">
              Seleccioná el tipo de documento que querés gestionar
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <FeatureCard
              icon={FileText}
              title="GENERADOR DE REPORTE"
              description="Gestioná lotes, productos y cantidades con exportación a PDF profesional"
              onClick={() => onSelectMode("inventory")}
              delay={0.1}
            />

            <FeatureCard
              icon={Wallet}
              title="Caja Chica"
              description="Registrá ingresos, egresos y controlá el saldo automáticamente"
              onClick={() => onSelectMode("pettycash")}
              delay={0.2}
            />

            <FeatureCard
              icon={Car}
              title="Gastos del Auto"
              description="Gestioná gastos con posibilidad de adjuntar recibos e imágenes"
              onClick={() => onSelectMode("autoexpenses")}
              delay={0.3}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
