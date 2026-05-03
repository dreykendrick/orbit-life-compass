import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface DndContextValue {
  isDnd: boolean;
  reason: string | null;
  enableDnd: (reason?: string) => void;
  disableDnd: () => void;
}

const DndContext = createContext<DndContextValue | undefined>(undefined);

export const DndProvider = ({ children }: { children: ReactNode }) => {
  const [isDnd, setIsDnd] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  const enableDnd = useCallback((r?: string) => {
    setIsDnd(true);
    setReason(r || "Focus mode");
  }, []);

  const disableDnd = useCallback(() => {
    setIsDnd(false);
    setReason(null);
  }, []);

  return (
    <DndContext.Provider value={{ isDnd, reason, enableDnd, disableDnd }}>
      {children}
    </DndContext.Provider>
  );
};

export const useDnd = () => {
  const ctx = useContext(DndContext);
  if (!ctx) throw new Error("useDnd must be used within DndProvider");
  return ctx;
};
