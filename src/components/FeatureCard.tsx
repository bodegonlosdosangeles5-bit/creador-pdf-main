import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

export const FeatureCard = ({ icon: Icon, title, description, onClick, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={onClick}
        className="group cursor-pointer p-0 overflow-hidden"
      >
        <div className="p-6 flex flex-col items-center text-center space-y-4">
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

