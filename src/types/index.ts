import { type eventWithTime } from '@appsurify-testmap/rrweb-types';

export type RRWebEvent = eventWithTime & {
  id?: number;
  testEventId?: string;
}

export interface RRWebNode {
    id: number;
    tagName: string;
    xPath?: string | null;
    isVisible?: boolean;
    isInteractive?: boolean;
    testEventId?: string;
    rrWebEventId?: string | number;
}

export type TestEventLog = {
  alias?: string;
  aliasType?: string;
  chainerId: string;
  createdAtTimestamp: number;
  ended: boolean;
  event: boolean;
  hidden: boolean;
  hookId?: string;
  id: string;
  instrument: string;
  isCrossOriginLog: boolean;
  message: string;
  name: string;
  state: string;
  testCurrentRetry?: number;
  testId: string;
  timeout?: number;
  totalTime?: number;
  type: string;
  updatedAtTimestamp: number;
  url?: string;
  viewportHeight: number;
  viewportWidth: number;
  wallClockStartedAt: string;
  coords: Record<string, number>;
};

export type TestEvent = {
  id: string;
  name: string;
  chainerId: string;
  args: unknown[];
  type: string;
  state: string;
  logs: TestEventLog[];
  timeout?: number;
  prev?: TestEventLink;
  next?: TestEventLink;
  timestamp: number;
};

export type TestEventLink = Pick<TestEvent, 'id' | 'name' | 'chainerId' | 'type' | 'state' | 'args'>;

export type TestInfoInvocationDetails = {
  absoluteFile: string;
  column: number;
  fileUrl?: string;
  function?: string;
  line: number;
  originalFile?: string;
  relativeFile: string;
};

export type TestSuiteInfo = {
    id: string;
    file?: string | null;
    invocationDetails: TestInfoInvocationDetails;
    order?: number;
    pending: boolean
    root: boolean;
    title: string;
    type: string;
}

export type TestInfo = {
    suite?: TestSuiteInfo;
    duration?: number;
    file?: string | null;
    hasAttemptPassed: boolean;
    id: string;
    invocationDetails: TestInfoInvocationDetails;
    order: number;
    pending: boolean;
    state?: string;
    sync: boolean;
    timedOut: unknown;
    title: string;
    titlePath: string[];
    fullTitle: string;
    type: string;
}

export type SpecInfo = {
    name: string;
    relative: string;
    absolute: string;
    specFilter?: string;
    specType?: string;
    baseName?: string;
    fileExtension?: string;
    fileName?: string;
    id?: string;
}

export type TestRunResult = {
    spec: SpecInfo;
    test: TestInfo;
    rrWebEvents: RRWebEvent[];
    rrWebNodes: RRWebNode[];
    testEvents: TestEvent[];
}

export type TestRunUICoverageReport = {
    spec: SpecInfo;
    test: TestInfo;
    pages: TestRunUICoveragePage[];
};

export type TestRunUICoveragePage = {
    id: string;
    href: string;
    snapshots: TestRunUICoveragePageSnapshot[];
    stats: {
        totalVisibleNodes: number;
        totalVisibleInteractiveNodes: number;
        interactedNodes: number;
        interactedInteractiveNodes: number;
        uniqueInteractedNodes: number;
        uniqueInteractedInteractiveNodes: number;
        interactionCoverageRatio: number;
        uniqueInteractionCoverageRatio: number;
        interactionCoveragePercent: number;
        uniqueInteractionCoveragePercent: number;
    }
};

export type TestRunUICoveragePageSnapshot = {
    id: string;
    testEventId?: string;
    meta: SnapshotMeta;
    rrwebEvents: RRWebEvent[];
    rrwebNodes: RRWebNode[];
    testEvents: TestEvent[];
    visibleNodes: RRWebNode[];
    visibleInteractiveNodes: RRWebNode[];
    stats: {
        totalVisibleNodes: number;
        totalVisibleInteractiveNodes: number;
        interactedNodes: number;
        interactedInteractiveNodes: number;
        uniqueInteractedNodes: number;
        uniqueInteractedInteractiveNodes: number;
        interactionCoverageRatio: number;
        uniqueInteractionCoverageRatio: number;
        interactionCoveragePercent: number;
        uniqueInteractionCoveragePercent: number;
    };
};


export type SnapshotMeta = {
    href: string;
    width: number;
    height: number;
};
