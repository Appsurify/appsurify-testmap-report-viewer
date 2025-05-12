import { Box, Text } from '@chakra-ui/react';
import type { TestRunUICoveragePageSnapshot } from '../types';

export interface SnapshotMetaInfoProps {
  snapshot: TestRunUICoveragePageSnapshot;
}

export default function SnapshotMetaInfo({ snapshot }: SnapshotMetaInfoProps) {
  const { testEventId, meta, visibleInteractiveNodes, rrwebNodes, testEvents } = snapshot;

  const testedCount = visibleInteractiveNodes.filter((node) =>
    rrwebNodes.some((r) => r.id === node.id && r.testEventId)
  ).length;

  const eventName =
    testEventId &&
    testEvents.find((e) => e.id === testEventId)?.name;

  const coveragePercent = (
    (testedCount / Math.max(1, visibleInteractiveNodes.length)) * 100
  ).toFixed(1);

  return (
    <Box px={4} py={2}>
      <Text fontSize="sm" fontWeight="medium">
        Last Test Event: {eventName || testEventId || '—'}
      </Text>
      <Text fontSize="xs" color="gray.500">
        Resolution: {meta.width}×{meta.height} •{' '}
        {testedCount} / {visibleInteractiveNodes.length} interactive ({coveragePercent}%)
      </Text>
    </Box>
  );
}
