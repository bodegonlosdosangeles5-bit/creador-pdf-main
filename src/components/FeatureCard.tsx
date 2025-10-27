import { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

export const FeatureCard = ({ icon: Icon, title, description, onClick, delay = 0 }: FeatureCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotación 3D de la tarjeta
  const rotateX = useTransform(y, [-50, 50], [15, -15]);
  const rotateY = useTransform(x, [-50, 50], [-15, 15]);

  // Movimiento inverso del reflejo (reacciona al mouse)
  const lightX = useTransform(x, [-50, 50], [15, -15]);
  const lightY = useTransform(y, [-50, 50], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    x.set(offsetX / 5);
    y.set(offsetY / 5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 50, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 120,
      }}
      whileTap={{ scale: 0.98 }}
    >
        <Card
          onClick={onClick}
          className="group cursor-pointer p-0 overflow-hidden relative transition-colors duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]"
        >
          {/* Reflejo dorado dinámico */}
          <motion.div
            style={{
              x: lightX,
              y: lightY,
              backgroundImage: "linear-gradient(120deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0.05) 50%, transparent 100%)",
            }}
            className="absolute top-0 left-0 w-full h-full pointer-events-none mix-blend-screen"
          ></motion.div>

          <div className="p-6 flex flex-col items-center text-center space-y-4 relative z-10">
            <motion.div 
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-[color:var(--text)] mb-2">
                {title}
              </h3>
              <p className="text-sm text-[color:var(--text-muted)]">
                {description}
              </p>
            </div>
          </div>
        </Card>
    </motion.div>
  );
};

