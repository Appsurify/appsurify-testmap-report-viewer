import type {
  elementNode,
  eventWithTime,
  fullSnapshotEvent,
  incrementalData,
  metaEvent,
  NodeLookup,
  RawReport,
  serializedNodeWithId,
  UICoverageAction,
  UICoverageElement,
  UICoveragePage,
  UICoveragePageSnapshot,
  visibilityMutationData,
  UICoverageReport
} from './types';

import {
  EventType,
  IncrementalSource,
  MediaInteractions,
  MouseInteractions,
  NodeType,
} from './types';

export function hasNodeId(data: incrementalData): data is incrementalData & { id: number } {
  return typeof data === 'object' && data !== null && 'id' in data && typeof (data as { id: unknown }).id === 'number';
}

export function collectNodes(node: serializedNodeWithId): UICoverageElement[] {
  const flat: UICoverageElement[] = [];

  function walk(n: serializedNodeWithId) {
    if (n?.type === NodeType.Element) {
      flat.push({
        id: n.id,
        tagName: (n as elementNode).tagName,
        xpath: n.xpath ?? undefined,
        isVisible: n.isVisible ?? false,
        isInteractive: n.isInteractive ?? false,
        selector: n.selector ?? undefined,
        attributes: n.attributes ?? {},
        isInteracted: false
      } as UICoverageElement);
    }
    for (const child of (n as elementNode).childNodes ?? []) {
      walk(child);
    }
  }

  walk(node);
  return flat;
}

export function collectActions(
  events: eventWithTime[],
  nodeMap: NodeLookup
): UICoverageAction[] {
  const logs: UICoverageAction[] = [];

  for (const e of events) {
    if (e.type !== EventType.IncrementalSnapshot) continue;

    const eventId = (e as {id?: number | string } & eventWithTime)?.id || `action-${logs.length+1}`;
    const data: incrementalData = e.data;

    // Hover events (MouseMove, TouchMove)
    if (
      data.source === IncrementalSource.MouseMove ||
      data.source === IncrementalSource.TouchMove
    ) {
      const positions = data.positions;
      for (const pos of positions) {
        const node = nodeMap.get(pos.id);
        if (!node) continue;

        logs.push({
          id: eventId,
          timestamp: e.timestamp + pos.timeOffset,
          source: data.source,
          action: 'hover',
          elementId: node.id,
          position: { x: pos.x, y: pos.y },
        });
      }
      continue;
    }

    // All other actionable incremental events
    // if (!hasNodeId(data)) continue;

    // -2 special incorrect node id
    const nodeId = hasNodeId(data) ? data.id : -2;
    const node = nodeMap.get(nodeId);
    if (!node) continue;

    let action: UICoverageAction['action'] | null = null;
    let value: UICoverageAction['value'];
    let position: UICoverageAction['position'];

    switch (data.source) {
      case IncrementalSource.MouseInteraction: {
        if (data.x && data.y) {
          value = `x=${data.x}, y=${data.y}`;
          position = { x: data.x, y: data.y };
        }

        switch (data.type) {
          case MouseInteractions.Click: action = 'click'; break;
          case MouseInteractions.DblClick: action = 'dblclick'; break;
          case MouseInteractions.ContextMenu: action = 'contextmenu'; break;
          case MouseInteractions.MouseDown: action = 'mousedown'; break;
          case MouseInteractions.MouseUp: action = 'mouseup'; break;
          case MouseInteractions.Focus: action = 'focus'; break;
          case MouseInteractions.Blur: action = 'blur'; break;
        }
        break;
      }

      case IncrementalSource.Input: {
        const tag = (node as elementNode).tagName?.toLowerCase();

        const rawType = (node as elementNode).attributes?.['type'];
        const type = typeof rawType === 'string' ? rawType.toLowerCase() : undefined;

        const isCheckboxOrRadio = tag === 'input' && (type === 'checkbox' || type === 'radio');
        const isTextLike = tag === 'input' || tag === 'textarea';
        const isSelect = tag === 'select';

        if (isCheckboxOrRadio) {
          action = 'check';
          value = data.isChecked;
        } else if (isSelect) {
          action = 'select';
          value = data.text;
        } else if (isTextLike) {
          action = 'type';
          value = data.text;
        } else {
          // fallback
          action = 'type';
          value = data.text ?? data.isChecked;
        }

        break;
      }

      case IncrementalSource.Scroll: {
        action = 'scroll';
        value = `x=${data.x}, y=${data.y}`;
        position = { x: data.x, y: data.y };
        break;
      }

      case IncrementalSource.Selection: {
        action = 'select';
        break;
      }

      case IncrementalSource.MediaInteraction: {
        switch (data.type) {
          case MediaInteractions.Play: action = 'play'; break;
          case MediaInteractions.Pause: action = 'pause'; break;
          case MediaInteractions.Seeked: action = 'seek'; break;
          case MediaInteractions.VolumeChange: action = 'volume'; break;
        }
        break;
      }

      default:
        continue; // Ignore all other incremental sources
    }

    if (action) {
      logs.push({
        id: eventId,
        timestamp: e.timestamp,
        source: data.source,
        action: action,
        elementId: node.id,
        value: value,
        position: position
      });
    }
  }

  return logs;
}

export function createSnapshot(events: eventWithTime[], snapshotIndex: number): UICoveragePageSnapshot {
  const id = `snap-${snapshotIndex}`;

  const fullSnapshot = events.find(e => e.type === EventType.FullSnapshot);
  const fullDom = (fullSnapshot as fullSnapshotEvent)?.data.node;

  const visibilityMap = new Map<number, boolean>();
  for (const event of events) {
    if (
      event.type === EventType.IncrementalSnapshot &&
      event.data.source === IncrementalSource.VisibilityMutation
    ) {
      const mutations = (event.data as unknown as visibilityMutationData).mutations;
      for (const { id, isVisible } of mutations) {
        visibilityMap.set(id, isVisible);
      }
    }
  }

  const elements = fullDom ? collectNodes(fullDom) : [];
  for (const event of events) {
    if (
      event.type === EventType.IncrementalSnapshot &&
      event.data.source === IncrementalSource.Mutation
    ) {
      for (const addMutation of event.data.adds) {
        if (addMutation.node.type === NodeType.Element) {
          elements.push({
            ...addMutation.node,
            isInteracted: false
          });
        }
      }
    }
  }

  for (const node of elements) {
    const overrideVisibility = visibilityMap.get(node.id);
    if (overrideVisibility !== undefined) {
      node.isVisible = overrideVisibility;
    }
  }

  const nodeMap = new Map<number, serializedNodeWithId>();
  for (const el of elements) {
    if (el.id != null) {
      nodeMap.set(el.id, el);
    }
  }

  const actions = collectActions(events, nodeMap);

  const elementActions = new Map<number | string, UICoverageAction>();
  for (const action of actions) {
    if (action.elementId) {
      elementActions.set(action.elementId, action);
    }
  }

  elements.map((element) => {
    element.isInteracted = elementActions.get(element.id) !== undefined;
  })
  const visibleElements = elements.filter(n => n?.isVisible);
  const visibleInteractiveElements = visibleElements.filter(n => n?.isInteractive);
  const interactedElements = visibleInteractiveElements.filter(n => n.isInteracted);

  const ratio = visibleInteractiveElements.length > 0 ? interactedElements.length / visibleInteractiveElements.length : 0;
  const percent = Math.round(ratio * 10000) / 100;
  return {
    id: id,
    events: events,
    elements: visibleInteractiveElements,
    actions: actions,
    coverageInfo: {
      total: elements.length,
      visible: visibleElements.length,
      interactive: visibleInteractiveElements.length,
      interacted: interactedElements.length,
      ratio: ratio,
      percentage: percent
    }
  };
}

export function createPages(events: eventWithTime[]): UICoveragePage[] {
  type EventGroup = { meta: metaEvent; events: eventWithTime[] };
  const eventGroups: EventGroup[] = [];

  let currentGroup: EventGroup | null = null;
  for (const event of events) {
    if (event.type === EventType.Meta) {
      currentGroup = { meta: event, events: [] };
      eventGroups.push(currentGroup);
    } else if (currentGroup) {
      currentGroup.events.push(event);
    }
  }

  const pageMap = new Map<string, UICoveragePage>();
  let snapshotIndex = 0;

  for (const { meta, events } of eventGroups) {
    const metaData = meta.data;
    const href = metaData.href;

    if (!pageMap.has(href)) {
      pageMap.set(href, {
        id: `page-${pageMap.size}`,
        href,
        snapshots: [],
        coverageInfo: {
          total: 0,
          visible: 0,
          interactive: 0,
          interacted: 0,
          ratio: 0,
          percentage: 0,
        }
      });
    }

    const page = pageMap.get(href)!;

    let buffer: eventWithTime[] = [];
    let currentFull: fullSnapshotEvent | null = null;

    for (const event of events) {
      if (event.type === EventType.FullSnapshot /* FullSnapshot */) {
        if (currentFull && buffer.length > 0) {
          const snapshotEvents = [meta, currentFull, ...buffer];
          page.snapshots.push(createSnapshot((snapshotEvents as eventWithTime[]), snapshotIndex++));
        }
        currentFull = event;
        buffer = [];
      } else {
        buffer.push(event);
      }
    }

    if (currentFull) {
      const snapshotEvents = [meta, currentFull, ...buffer];
      page.snapshots.push(createSnapshot((snapshotEvents as eventWithTime[]), snapshotIndex++));
    }

    const allElements = new Map<number, UICoverageElement>();
    const allVisibleElements = new Map<number, UICoverageElement>();
    const allVisibleInteractiveElements = new Map<number, UICoverageElement>();
    const allInteracted = new Map<number, UICoverageElement>();

    for (const snap of page.snapshots) {
      for (const el of snap.elements) {
        allElements.set(el.id, el);
      }
      for (const el of snap.elements.filter(n => n.isVisible)) {
        allVisibleElements.set(el.id, el);
      }
      for (const el of snap.elements.filter(n => n.isVisible && n.isInteractive)) {
        allVisibleInteractiveElements.set(el.id, el);
      }
      for (const el of snap.elements.filter(n => n.isInteracted)) {
        allInteracted.set(el.id, el);
      }
    }
    page.coverageInfo.total = allElements.size;
    page.coverageInfo.visible = allVisibleElements.size;
    page.coverageInfo.interactive = allVisibleInteractiveElements.size;
    page.coverageInfo.interacted = allInteracted.size;
    page.coverageInfo.ratio = allVisibleInteractiveElements.size > 0 ? allInteracted.size / allVisibleInteractiveElements.size : 0;
    page.coverageInfo.percentage = Math.round(page.coverageInfo.ratio * 10000) / 100;

  }

  return Array.from(pageMap.values());
}

export function transformRawToUICoverage(raw: RawReport): UICoverageReport {
  const { metadata = {}, events } = raw;
  const {
    runner = {},
    spec = {},
    test = {},
    suite = {},
    browser = {}
  } = metadata;
  const pages = createPages(events);

  return {
    runner,
    spec,
    test,
    suite,
    browser,
    pages
  }
}
