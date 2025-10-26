import { useState } from "react";
import { ModeSelector } from "@/components/ModeSelector";
import { InventoryTable } from "@/components/InventoryTable";
import { PettyCashTable } from "@/components/PettyCashTable";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { DataMode } from "@/types";

const Index = () => {
  const [mode, setMode] = useState<DataMode | null>(null);

  const handleSelectMode = (selectedMode: DataMode) => {
    setMode(selectedMode);
  };

  const handleBack = () => {
    setMode(null);
  };

  if (mode === "inventory") {
    return <InventoryTable onBack={handleBack} />;
  }

  if (mode === "pettycash") {
    return <PettyCashTable onBack={handleBack} />;
  }

  return (
    <>
      <ThemeToggle />
      <ModeSelector onSelectMode={handleSelectMode} />
    </>
  );
};

export default Index;
