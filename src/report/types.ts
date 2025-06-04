import type {
    eventWithTime,
    serializedNodeWithId,
    elementNode,
    incrementalData,
    metaEvent,
    fullSnapshotEvent,
    visibilityMutationData,
    mutationData,
} from '@appsurify-testmap/rrweb-types';

import {
    IncrementalSource,
    MediaInteractions,
    MouseInteractions,
    NodeType,
    EventType,
} from '@appsurify-testmap/rrweb-types';

export interface RawReport {
    metadata?: Partial<{
        runner?: Partial<RunnerMetadata>;
        spec?: Partial<SpecMetadata>;
        test?: Partial<TestMetadata>;
        suite?: Partial<SuiteMetadata>;
        browser?: Partial<BrowserMetadata>;
    }>;
    events: eventWithTime[];
}

export interface RunnerMetadata {
    source: 'cypress' | 'playwright' | 'extension' | string,
    type: 'e2e' | 'component' | 'manual' | string,
    version: string,
    platform?: string,
    arch?: string,
    recorder?: {
      scriptVersion?: string,
      libVersion?: string,
    }
}

export interface InvocationDetails {
  absoluteFile: string;
  column?: number;
  fileUrl?: string;
  function?: string;
  line?: number;
  originalFile?: string;
  relativeFile?: string;
}

export interface SuiteMetadata {
    id: string;
    title: string;
    type: string;
    root: boolean;
    invocationDetails?: Partial<InvocationDetails>;
    file?: string | null;
    order?: number;
}

export interface TestMetadata {
    id?: string;
    file?: string;
    state?: string;
    title: string;
    fullTitle: string;
    titlePath: string[];
    suite?: Partial<SuiteMetadata>;
    invocationDetails?: Partial<InvocationDetails>;
    duration?: number;
    type?: string;
    order?: number;
    sync?: boolean;
}

export interface SpecMetadata {
    id?: string;
    name?: string;
    relative?: string;
    absolute?: string;
    specFilter?: string;
    specType?: string;
    baseName?: string;
    fileExtension?: string;
    fileName?: string;
}

export interface BrowserMetadata {
    name: string;
    version: string;
    displayName?: string;
    family?: string;
    isHeaded?: boolean;
    isHeadless?: boolean;
    majorVersion?: string | number;
    channel?: string;
    path?: string;
}

export interface UICoverageAction {
  id?: number | string;
  timestamp: number;

  // источник события
  source: IncrementalSource;

  // нормализованное имя действия
  action: 'click' | 'dblclick' | 'contextmenu' | 'mousedown' | 'mouseup' |
          'focus' | 'blur' |
          'type' | 'check' |
          'scroll' |
          'select' |
          'play' | 'pause' | 'seek' | 'volume' |
          'hover'; // <- mousemove/touchmove

  // мета-информация об элементе
  node?: serializedNodeWithId;

  // конкретное значение действия
  value?: string | number | boolean;

  // позиция (для scroll/hover)
  position?: { x: number; y: number };
}

export interface UICoveragePageSnapshot {
    id: string;
    events: eventWithTime[];
    totalElements: serializedNodeWithId[];  // Visible interactive nodes
    interactedElements: serializedNodeWithId[]; // Only interacted from (events) nodes
    actions: UICoverageAction[];
    totalElementCount: number;
    interactedElementCount: number;
    coverageRatio: number;      // e.g. 0.67
    coveragePercent: number;    // e.g. 67.1
}

export interface UICoveragePage {
    id: string;
    href: string;
    snapshots: UICoveragePageSnapshot[];
    totalElementCount: number;
    interactedElementCount: number;
    coverageRatio: number;      // e.g. 0.67
    coveragePercent: number;    // e.g. 67.1
}

export interface UICoverageReport {
    runner?: Partial<RunnerMetadata>;
    spec?: Partial<SpecMetadata>;
    test?: Partial<TestMetadata>;
    suite?: Partial<SuiteMetadata>;
    browser?: Partial<BrowserMetadata>;
    pages: UICoveragePage[];
}

export interface EnrichedNode {
  node: serializedNodeWithId;
  actions: UICoverageAction[];
  isInteracted: boolean;
}

export type NodeLookup = Map<number, serializedNodeWithId>;

export type {
    eventWithTime,
    serializedNodeWithId,
    elementNode,
    incrementalData,
    visibilityMutationData,
    mutationData,
    metaEvent,
    fullSnapshotEvent
}

export {
    IncrementalSource,
    MediaInteractions,
    MouseInteractions,
    NodeType,
    EventType,
}
