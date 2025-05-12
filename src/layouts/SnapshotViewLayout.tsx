import {
  Badge,
  Box,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import {useEffect, useRef, useState} from 'react';
import { useSnapshot } from '../context/SnapshotContext';
import SnapshotNavigator from '../components/SnapshotNavigator';
import InteractiveNodeList from '../components/InteractiveNodeList';
import TestEventList from '../components/TestEventList';
import RRWebPlayer, {type RRWebPlayerRef} from "../components/RRWebPlayer.tsx";
import type {TestEvent} from "../types";
import SnapshotMetaInfo from "../components/SnapshotMetaInfo.tsx";


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


  const handleSelectTestEvent = (testEvent: TestEvent) => {
      setSelectedEventId(testEvent.id);
      const rrEvent = [...snapshot.rrwebEvents].reverse().find(e => e.testEventId === testEvent.id);
      if (rrEvent) {
          playerRef.current?.seekToTimestamp(rrEvent.timestamp);
      }

      const relatedNodes = snapshot.rrwebNodes.filter(n => n.testEventId === testEvent.id);
      const uniqueNodes = Array.from(new Map(relatedNodes.map(n => [n.id, n])).values());

      for (const node of uniqueNodes) {
        playerRef.current?.highlightNode(node.id, 'rgba(0, 255, 0, 0.3)');
      }
  };
  const selectedNodeId = snapshot.rrwebNodes.find(n => n.testEventId === selectedEventId)?.id ?? null;

  return (
    <VStack align="stretch" spacing={4} height="100%">

      <SnapshotNavigator />

      <Flex flex="1" width="100%" gap={4} overflow="hidden">

        <Box width="260px" flexShrink={0} overflowY="auto" pr={2}>

          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            DOM Elements <Badge colorScheme="green">{snapshot.stats.uniqueInteractedInteractiveNodes} / {snapshot.stats.totalVisibleInteractiveNodes}</Badge>
          </Text>

          <InteractiveNodeList playerRef={playerRef} onSelectTestEvent={handleSelectTestEvent} selectedNodeId={selectedNodeId} />

        </Box>

        <Box flex="1" minWidth="300px" overflow="hidden">

          <SnapshotMetaInfo snapshot={snapshot} />

          <RRWebPlayer rrWebEvents={snapshot.rrwebEvents} ref={playerRef} />

        </Box>

        <Box width="320px" flexShrink={0} overflowY="auto" pl={2}>

          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            Test Events
          </Text>

          <TestEventList testEvents={snapshot.testEvents} testNodes={snapshot.rrwebNodes} selectedId={selectedEventId} onSelect={handleSelectTestEvent} />

        </Box>

      </Flex>

    </VStack>
  );
}
