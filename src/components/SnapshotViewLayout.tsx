import {
  Badge,
  Box,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import {useEffect, useRef, useState} from 'react';
import { useSnapshot } from '../context/SnapshotContext';
import SnapshotNavigator from './SnapshotNavigator';
import InteractiveNodeList from './InteractiveNodeList';
import TestEventList from './TestEventList';
import RRWebPlayer, {type RRWebPlayerRef} from "./RRWebPlayer.tsx";
import type {TestEvent} from "../types";
import SnapshotMetaInfo from "./SnapshotMetaInfo.tsx";


export default function SnapshotViewLayout() {
  const { snapshot, setSnapshot, snapshots } = useSnapshot();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const playerRef = useRef<RRWebPlayerRef>(null);
  useEffect(() => {
    if (!snapshot && snapshots.length > 0) {
      setSnapshot(snapshots[0]);
    }
  }, [snapshot, setSnapshot, snapshots]);

  useEffect(() => {
      setSelectedEventId(null);
  }, [snapshot?.id]);


  if (!snapshot) {
    return <Text color="red.500" p={6}>Snapshot not found</Text>;
  }

  const isTested = (nodeId: number) =>
    snapshot.rrwebNodes.some((r) => r.id === nodeId && r.testEventId);

  const testedCount = snapshot.visibleInteractiveNodes.filter((n) =>
    isTested(n.id)
  ).length;

  const handleSelectTestEvent = (testEvent: TestEvent) => {
      setSelectedEventId(testEvent.id);
      const rrEvent = [...snapshot.rrwebEvents].reverse().find(e => e.testEventId === testEvent.id);
      if (rrEvent) {
          playerRef.current?.seekToTimestamp(rrEvent.timestamp);

      }
  };

  return (
    <VStack align="stretch" spacing={4} height="100%">
      <SnapshotNavigator />

      <Flex flex="1" width="100%" gap={4} overflow="hidden">
        {/* Левая колонка */}
        <Box
          width="260px"
          flexShrink={0}
          overflowY="auto"
          borderRight="1px solid"
          borderColor="gray.200"
          pr={2}
        >
          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            DOM Elements <Badge colorScheme="green">{testedCount} / {snapshot.visibleInteractiveNodes.length}</Badge>
          </Text>
          <InteractiveNodeList playerRef={playerRef} />
        </Box>

        {/* Центральная колонка */}
        <Box flex="1" minWidth="300px" overflow="hidden">
          <SnapshotMetaInfo snapshot={snapshot} />

          <RRWebPlayer rrWebEvents={snapshot.rrwebEvents} ref={playerRef} />
        </Box>

        {/* Правая колонка */}
        <Box
          width="320px"
          flexShrink={0}
          overflowY="auto"
          borderLeft="1px solid"
          borderColor="gray.200"
          pl={2}
        >
          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            Test Events
          </Text>
          <TestEventList
            testEvents={snapshot.testEvents}
            selectedId={selectedEventId}
            onSelect={handleSelectTestEvent}
          />
        </Box>
      </Flex>
    </VStack>
  );
}
