import { createContext, useContext, useState, type ReactNode } from 'react';
import type { TestRunUICoverageReport } from '../types';


interface ReportContextType {
  report: TestRunUICoverageReport | null;
  setReport: (report: TestRunUICoverageReport) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<TestRunUICoverageReport | null>(null);
  return (
    <ReportContext.Provider value={{ report, setReport }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
}
