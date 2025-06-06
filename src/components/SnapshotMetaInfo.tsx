import { Box, Text } from '@chakra-ui/react';
import type { UICoveragePageSnapshot } from '../report/types';

export interface SnapshotMetaInfoProps {
  snapshot: UICoveragePageSnapshot;
}

export default function SnapshotMetaInfo({ snapshot }: SnapshotMetaInfoProps) {
  const { events } = snapshot;

  // @ts-ignore
  const firstMeta = events.find((e) => e.type === 4);
  // const eventName =
  //   testEventId &&
  //   testEvents.find((e) => e.id === testEventId)?.name;

    // @ts-ignore
    const width = firstMeta?.data.width || 0;
    // @ts-ignore
    const height = firstMeta?.data.height || 0;


  return (
    <Box px={4} py={2}>

      <Text fontSize="xs" color="gray.500">

        Resolution: {width}×{height} •{' '}
        {snapshot.coverageInfo.interacted} / {snapshot.coverageInfo.interactive} interactive ({snapshot.coverageInfo.percentage}%)
      </Text>
    </Box>
  );
}
