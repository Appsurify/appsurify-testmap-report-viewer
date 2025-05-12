import {
  Box,
  Text,
  VStack,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useSnapshot } from '../context/SnapshotContext';
import { useMemo } from 'react';
import type { RRWebPlayerRef } from './RRWebPlayer';
import type {TestEvent} from "../types";

interface Props {
  playerRef: React.RefObject<RRWebPlayerRef | null>;
  onSelectTestEvent?: (event: TestEvent) => void;
  selectedNodeId?: number | null;
}

// @ts-ignore
export default function InteractiveNodeList({ playerRef, onSelectTestEvent, selectedNodeId }: Props) {
  const { snapshot } = useSnapshot();
  const nodes = snapshot?.visibleInteractiveNodes ?? [];
  const rrwebNodes = snapshot?.rrwebNodes ?? [];

  const isTested = (nodeId: number) =>
    rrwebNodes.some((r) => r.id === nodeId && r.testEventId);

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => {
      const aTested = isTested(a.id);
      const bTested = isTested(b.id);
      return Number(bTested) - Number(aTested);
    });
  }, [nodes, rrwebNodes]);

  if (!snapshot) {
    return <Text color="gray.500">Elements not found</Text>;
  }

  return (
    <VStack align="stretch" spacing={3}>
      <Box>
        <List spacing={2}>
          {sortedNodes.map((node) => {
            const tested = isTested(node.id);
            const isSelected = selectedNodeId === node.id;

            return (
              <ListItem
                key={node.id}
                p={2}
                borderLeft="4px solid"
                borderColor={tested ? 'green.200' : 'red.200'}
                bg={isSelected ? (tested ? 'green.100' : 'red.100') : tested ? 'green.50' : 'red.50'}
                borderRadius="md"
                cursor="pointer"
                onClick={() => {
                  if (!tested) return;

                  const rrwebNode = [...rrwebNodes].reverse().find(r => r.id === node.id);
                  const testEvent = [...snapshot.testEvents].reverse().find(e => e.id === rrwebNode?.testEventId);

                  if (testEvent && onSelectTestEvent) {
                    onSelectTestEvent(testEvent);
                  }
                }}
              >
                <Text fontSize="sm" fontWeight="medium">
                  {node.tagName} #{node.id}
                </Text>

                {node.xPath && (
                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                    {node.xPath}
                  </Text>
                )}

              </ListItem>
            );
          })}
        </List>
      </Box>
    </VStack>
  );
}
