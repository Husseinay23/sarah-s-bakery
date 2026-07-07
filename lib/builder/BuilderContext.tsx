"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type BuilderTarget = "mini-box" | "package";

interface BuilderContextValue {
  highlightedFlavorId: string | null;
  navigateToBuilder: (flavorId: string, target: BuilderTarget) => void;
  consumeHighlight: () => string | null;
  packagePieceCountHint: number | null;
  consumePackageHint: () => number | null;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [highlightedFlavorId, setHighlightedFlavorId] = useState<string | null>(null);
  const [packagePieceCountHint, setPackagePieceCountHint] = useState<number | null>(null);

  const navigateToBuilder = useCallback((flavorId: string, target: BuilderTarget) => {
    setHighlightedFlavorId(flavorId);
    if (target === "package") {
      setPackagePieceCountHint(12);
      setTimeout(() => setPackagePieceCountHint(null), 3000);
    }

    const sectionId = target === "mini-box" ? "mini-box" : "order";
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => setHighlightedFlavorId(null), 5000);
  }, []);

  const consumeHighlight = useCallback(() => {
    const id = highlightedFlavorId;
    if (id) {
      setTimeout(() => setHighlightedFlavorId(null), 4000);
    }
    return id;
  }, [highlightedFlavorId]);

  const consumePackageHint = useCallback(() => {
    const hint = packagePieceCountHint;
    if (hint !== null) {
      setTimeout(() => setPackagePieceCountHint(null), 100);
    }
    return hint;
  }, [packagePieceCountHint]);

  return (
    <BuilderContext.Provider
      value={{
        highlightedFlavorId,
        navigateToBuilder,
        consumeHighlight,
        packagePieceCountHint,
        consumePackageHint,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
  return ctx;
}
