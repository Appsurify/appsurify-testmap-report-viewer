import type {
  UICoverageReport,
  RawReport
} from './types';

import { createPages } from './utils';

export function loadFromResult(raw: RawReport): UICoverageReport {
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
