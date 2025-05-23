import {createContext, useContext, useState, type ReactNode, useEffect} from 'react';
import type { UICoveragePageSnapshot } from '../types';

interface SnapshotContextType {
  snapshot: UICoveragePageSnapshot | null;
  setSnapshot: (snapshot: UICoveragePageSnapshot | null) => void;
  snapshots: UICoveragePageSnapshot[];
  setSnapshots: (snapshots: UICoveragePageSnapshot[]) => void;
  selectSnapshotById: (id: string) => void;
}

const SnapshotContext = createContext<SnapshotContextType | undefined>(undefined);

export function SnapshotProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<UICoveragePageSnapshot | null>(null);
  const [snapshots, setSnapshots] = useState<UICoveragePageSnapshot[]>([]);

  useEffect(() => {
    if (!snapshot && snapshots.length > 0) {
      setSnapshot(snapshots[0]);
    }
  }, [snapshots, snapshot]);
  function selectSnapshotById(id: string) {
    const snapshot = snapshots.find((s) => s.id === id) ?? null;
    setSnapshot(snapshot);
  }

  return (
    <SnapshotContext.Provider value={{ snapshot, setSnapshot, snapshots, setSnapshots, selectSnapshotById }}>
      {children}
    </SnapshotContext.Provider>
  );
}

export function useSnapshot() {
  const context = useContext(SnapshotContext);
  if (!context) throw new Error('useSnapshot must be used within SnapshotProvider');
  return context;
}
