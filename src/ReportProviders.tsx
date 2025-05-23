import { type ReactNode } from 'react';
import { ReportProvider } from './context/ReportContext';
import { PageProvider } from './context/PageContext';
import { SnapshotProvider } from './context/SnapshotContext';
import {SelectionProvider} from "./context/SelectionContext.tsx";

export default function ReportProviders({ children }: { children: ReactNode }) {
  return (
    <ReportProvider>
        <PageProvider>
            <SnapshotProvider>
                <SelectionProvider>
                    {children}
                </SelectionProvider>
            </SnapshotProvider>
        </PageProvider>
    </ReportProvider>
  );
}
