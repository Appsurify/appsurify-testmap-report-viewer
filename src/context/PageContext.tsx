import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UICoveragePage } from '../types';

interface PageContextType {
  page: UICoveragePage | null;
  setPage: (page: UICoveragePage | null) => void;
  pages: UICoveragePage[];
  setPages: (pages: UICoveragePage[]) => void;
  selectPageById: (id: string) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<UICoveragePage | null>(null);
  const [pages, setPages] = useState<UICoveragePage[]>([]);

  function selectPageById(id: string) {
    const page = pages.find((p) => p.id === id) ?? null;
    setPage(page);
  }

  return (
    <PageContext.Provider value={{ page, setPage, pages, setPages, selectPageById }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (!context) throw new Error('usePage must be used within PageProvider');
  return context;
}
