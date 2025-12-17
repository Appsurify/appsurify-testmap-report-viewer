import React, {createContext, useContext, useState, type ReactNode, useCallback, useRef} from 'react';
import type {UICoverageAction} from '../report/types';
import type {RRWebPlayerRef} from '../components/RRWebPlayer';

type SelectionState = {
  selectedElement: unknown | null;
  selectedAction: UICoverageAction | null;
};

interface SelectionContextType {
  selection: SelectionState;
  setSelection: React.Dispatch<React.SetStateAction<SelectionState>>;
  updateSelection: (partial: Partial<SelectionState>, playerRef?: React.RefObject<RRWebPlayerRef>) => void;
  resetSelection: () => void;
  playerRef: React.RefObject<RRWebPlayerRef | null>;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<SelectionState>({
    selectedElement: null,
    selectedAction: null,
  });
  const playerRef = useRef<RRWebPlayerRef | null>(null);

  const updateSelection = useCallback((
    partial: Partial<SelectionState>,
    playerRefFromParent?: React.RefObject<RRWebPlayerRef>
  ) => {
    const targetPlayerRef = playerRefFromParent ?? playerRef;

    setSelection((prev) => {
      const newSelection = { ...prev, ...partial };

      // Автоматическая перемотка плеера при выборе действия
      if (
        newSelection.selectedAction &&
        targetPlayerRef.current
      ) {
        targetPlayerRef.current.seekToAction(newSelection.selectedAction);
      }

      return newSelection;
    });
  }, []);

  const resetSelection = useCallback(() => {
    setSelection({ selectedElement: null, selectedAction: null });
  }, []);

  return (
    <SelectionContext.Provider
      value={{
        selection,
        setSelection,
        updateSelection,
        resetSelection,
        playerRef
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error('useSelection must be used within SelectionProvider');
  return context;
}
