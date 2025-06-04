import {
  Badge,
  Box,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';
import {useEffect, useRef} from 'react';
import { useSnapshot } from '../context/SnapshotContext';
import SnapshotNavigator from '../components/SnapshotNavigator';
import RRWebPlayer, {type RRWebPlayerRef} from '../components/RRWebPlayer.tsx';
import SnapshotMetaInfo from '../components/SnapshotMetaInfo.tsx';
import ElementList from '../components/ElementList.tsx';
import ActionList from '../components/ActionList.tsx';
import {useSelection} from '../context/SelectionContext.tsx';
import type {UICoverageAction} from '../report/types.ts';

export default function SnapshotViewLayout() {
  const { snapshot, setSnapshot, snapshots } = useSnapshot();

  const { resetSelection } = useSelection();

  const playerRef = useRef<RRWebPlayerRef>(null);

  useEffect(() => {
    if (!snapshot && snapshots.length > 0) {
      setSnapshot(snapshots[0]);
    }
  }, [snapshot, setSnapshot, snapshots]);

  useEffect(() => {
      resetSelection();
  }, [snapshot?.id]);


  if (!snapshot) {
    return <Text color="red.500" p={6}>Snapshot not found</Text>;
  }


  const handleSelectAction = (action: UICoverageAction) => {
        playerRef.current?.seekToTimestamp?.(action.timestamp);
  };
  // const selectedNodeId = snapshot.interactedElements.find(n => n.testEventId === selectedEventId)?.id ?? null;
  // const selectedNodeId = null;
  return (
    <VStack align="stretch" spacing={4} height="100%">

      <SnapshotNavigator />

      <Flex flex="1" width="100%" gap={4} overflow="hidden">

        <Box width="260px" flexShrink={0} overflowY="auto" pr={2}>

          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            DOM Elements <Badge colorScheme="green">{snapshot.interactedElementCount} / {snapshot.totalElementCount}</Badge>
          </Text>

          <ElementList playerRef={playerRef} />

        </Box>

        <Box flex="1" minWidth="300px" overflow="hidden">

          <SnapshotMetaInfo snapshot={snapshot} />

          <RRWebPlayer events={snapshot.events} ref={playerRef} />

        </Box>

        <Box width="320px" flexShrink={0} overflowY="auto" pl={2}>

          <Text fontSize="sm" fontWeight="semibold" mb={2}>
            Test Events
          </Text>

          <ActionList actions={snapshot.actions} onSelect={handleSelectAction} />

        </Box>

      </Flex>

    </VStack>
  );
}
