import type {
  UICoverageReport,
  RunnerMetadata,
  SpecMetadata,
  TestMetadata,
  SuiteMetadata,
  BrowserMetadata,
  UICoveragePage,
  RawReport,
  UICoveragePageSnapshot,
  UICoverageAction,
  eventWithTime,
  CoverageInfo,
  UICoverageElement,

} from './types.ts';

import {
  transformRawToUICoverage
} from './utils.ts';

export class Report implements UICoverageReport {
  public runner?: Partial<RunnerMetadata>;
  public spec?: Partial<SpecMetadata>;
  public test?: Partial<TestMetadata>;
  public suite?: Partial<SuiteMetadata>;
  public browser?: Partial<BrowserMetadata>;
  public pages: Page[] = [];
  private pageMap = new Map<string, Page>();

  constructor(data: Partial<UICoverageReport>) {
    this.runner = data.runner;
    this.spec = data.spec;
    this.test = data.test;
    this.suite = data.suite;
    this.browser = data.browser;
    this.pages = (data.pages ?? []).map(page => new Page(page));
    this.pageMap = new Map(this.pages.map(page => [page.id, page]));
  }

  public static fromRaw(raw: RawReport): Report {
    const data = transformRawToUICoverage(raw);
    return new Report(data);
  }

  public static fromJSON(data: UICoverageReport): Report {
    return new Report(data);
  }

  public toJSON(): UICoverageReport {
    return {
      runner: this.runner,
      spec: this.spec,
      test: this.test,
      suite: this.suite,
      browser: this.browser,
      pages: this.pages.map(p => p.toJSON())
    };
  }

  public getPage(id: string): Page | undefined {
    return this.pageMap.get(id);
  }

  public getPages(): Page[] {
    return this.pages;
  }
}


export class Page implements UICoveragePage {
  public id: string;
  public href: string;
  public snapshots: Snapshot[] = [];
  public coverageInfo: CoverageInfo;

  private snapshotMap = new Map<number | string, Snapshot>();

  constructor(data: UICoveragePage) {
    this.id = data.id;
    this.href = data.href;
    this.snapshots = (data.snapshots ?? []).map(snapshot => Snapshot.fromJSON(snapshot));
    this.coverageInfo = data.coverageInfo;
    this.snapshotMap = new Map(this.snapshots.map(snapshot => [snapshot.id, snapshot]));
  }

  public getSnapshot(id: number | string): Snapshot | null {
    return this.snapshotMap.get(id) || null
  }

  public static fromJSON(data: UICoveragePage): Page {
    return new Page(data);
  }

  public toJSON(): UICoveragePage {
    return {
      id: this.id,
      href: this.href,
      snapshots: this.snapshots.map(snapshot => snapshot.toJSON()),
      coverageInfo: this.coverageInfo,
    }
  }
}


export class Snapshot implements UICoveragePageSnapshot {
  public id: string;
  public events: eventWithTime[] = [];
  public elements: UICoverageElement[] = [];
  public actions: UICoverageAction[] = [];
  public coverageInfo: CoverageInfo;

  private actionMap = new Map<number | string, UICoverageAction>();
  private elementMap = new Map<number | string, UICoverageElement>();

  private actionElementsMap = new Map<number | string, UICoverageElement[]>();
  private elementActionsMap = new Map<number | string, UICoverageAction[]>();

  constructor(data: UICoveragePageSnapshot) {
    this.id = data.id;
    this.events = data.events;
    this.elements = data.elements;
    this.actions = data.actions;
    this.coverageInfo = data.coverageInfo;
    this.actionMap = new Map(this.actions.map(action => [action.id, action]));
    this.elementMap = new Map(this.elements.map(element => [element.id, element]));

    for (const action of this.actions) {
      const elementId = action.elementId;
      if (elementId == null) continue;

      const element = this.elementMap.get(elementId);
      if (!element) continue;

      // 1. elementActionsMap
      if (!this.elementActionsMap.has(elementId)) {
        this.elementActionsMap.set(elementId, []);
      }
      this.elementActionsMap.get(elementId)!.push(action);

      // 2. actionElementsMap
      if (!this.actionElementsMap.has(action.id)) {
        this.actionElementsMap.set(action.id, []);
      }
      this.actionElementsMap.get(action.id)!.push(element);
    }

  }

  public getAction(id: number | string): UICoverageAction | null {
    return this.actionMap.get(id) || null;
  }

  public getElement(id: number | string): UICoverageElement | null {
    return this.elementMap.get(id) || null;
  }

  public getElementActions(id: number | string): UICoverageAction[] {
    return this.elementActionsMap.get(id) || [];
  }

  public getActionElements(id: number | string): UICoverageElement[] {
    return this.actionElementsMap.get(id) || [];
  }

  public static fromJSON(data: UICoveragePageSnapshot): Snapshot {
    return new Snapshot(data)
  }

  public toJSON(): UICoveragePageSnapshot {
    return {
      id: this.id,
      events: this.events,
      elements: this.elements,
      actions: this.actions,
      coverageInfo: this.coverageInfo,
    }
  }


}
