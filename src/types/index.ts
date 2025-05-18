import { type eventWithTime } from '@appsurify-testmap/rrweb-types';

export type RRWebEvent = eventWithTime & {
  id?: number;
}

export type RRWebNode = {
    id: number;
    xPath: string;
    selector?: string;
    isVisible?: boolean;
    isInteractive?: boolean;
};

export type TestEventPayload = {
    element?: RRWebNode;
    state?: string;
    args?: string[];
    query?: boolean;
    timeout?: number;
    name?: string;
    type?: string;
    id?: string,
    prev?: {
        state?: string;
        name?: string;
        args?: string[];
        type?: string;
        query?: boolean;
        id?: string,
    };
    next?: {
        state?: string;
        name?: string;
        args?: string[];
        type?: string;
        query?: boolean;
        id?: string,
    };
};

export type TestEvent = RRWebEvent & {
    type: 5,
    data: {
        tag: string;
        payload: TestEventPayload
    }
}

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
    hasAttemptPassed?: boolean;
    id?: string;
    invocationDetails?: TestInfoInvocationDetails;
    order?: number;
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

export type BrowserInfo = {
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

export type TestRunResult = {
    spec: SpecInfo;
    test: TestInfo;
    browser: BrowserInfo;
    recorderEvents: any[];
}

export type TestRunUICoverageReport = {
    spec: SpecInfo;
    test: TestInfo;
    browser: BrowserInfo;
    pages: TestRunUICoveragePage[];
};

export type TestRunUICoveragePage = {
    id: string;
    href: string;
    snapshots: TestRunUICoveragePageSnapshot[];
    totalElementCount: number;
    interactedElementCount: number;
    coverageRatio: number;      // e.g. 0.67
    coveragePercent: number;    // e.g. 67.1
};

export type TestRunUICoveragePageSnapshot = {
    id: string;
    events: TestEvent[];
    totalElements: any[];  // Visible interactive nodes
    interactedElements: {
        node: RRWebNode;
        events: TestEvent[];
    }[]; // Only interacted from (events) nodes
    totalElementCount: number;
    interactedElementCount: number;
    coverageRatio: number;      // e.g. 0.67
    coveragePercent: number;    // e.g. 67.1
};
