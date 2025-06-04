import {createContext, useContext, useState, type ReactNode, useCallback} from 'react';
import type {UICoverageAction} from '../report/types';

type SelectionState = {
  selectedElement: unknown | null;
  selectedAction: UICoverageAction | null;
};

interface SelectionContextType {
  selection: SelectionState;
  setSelection: React.Dispatch<React.SetStateAction<SelectionState>>;
  updateSelection: (partial: Partial<SelectionState>) => void;
  resetSelection: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>({
    selectedElement: null,
    selectedAction: null,
  });

  const updateSelection = useCallback((partial: Partial<SelectionState>) => {
    setSelection((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetSelection = useCallback(() => {
    setSelection({ selectedElement: null, selectedAction: null });
  }, []);

  return (
    <SelectionContext.Provider value={{ selection, setSelection, updateSelection, resetSelection }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('useSnapshot must be used within SnapshotProvider');
  return context;
}
