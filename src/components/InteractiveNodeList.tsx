// src/components/InteractiveNodeList.tsx
import {
  Box, Text, VStack, List, ListItem, Drawer, DrawerBody,
  DrawerOverlay, DrawerContent, DrawerHeader, useDisclosure
} from '@chakra-ui/react';
import { useSnapshot } from '../context/SnapshotContext';
import { useMemo, useState } from 'react';
import type { RRWebPlayerRef } from './RRWebPlayer';
import type { TestEvent } from '../types';
import TestEventList from './TestEventList';

interface Props {
  playerRef: React.RefObject<RRWebPlayerRef | null>;
  onSelectTestEvent?: (event: TestEvent) => void;
  selectedNodeId?: number | null;
}

export default function InteractiveNodeList({ playerRef, onSelectTestEvent, selectedNodeId }: Props) {
  const { snapshot } = useSnapshot();
  const nodes = snapshot?.totalElements ?? [];
  const rrwebNodes = snapshot?.interactedElements ?? [];

  const [activeNode, setActiveNode] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectedEvents = useMemo(() => {
    return rrwebNodes.find((r) => r.node.id === activeNode)?.events ?? [];
  }, [activeNode, rrwebNodes]);

  const isTested = (nodeId: number) => rrwebNodes.some((r) => r.node.id === nodeId);

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => Number(isTested(b.id)) - Number(isTested(a.id)));
  }, [nodes, rrwebNodes]);

  if (!snapshot) {
    return <Text color="gray.500">Elements not found</Text>;
  }

  return (
    <>
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
                  cursor={tested ? 'pointer' : 'default'}
                  onClick={() => {
                    if (!tested) return;
                    setActiveNode(node.id);
                    onOpen();
                    playerRef.current?.highlightNode?.(node.id, 'rgba(0, 255, 0, 0.2)');
                  }}
                  onMouseEnter={() => {
                    const color = tested ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.3)';
                    playerRef.current?.highlightNode?.(node.id, color);
                  }}
                  onMouseLeave={() => {
                    // playerRef.current?.highlightNode?.(node.id, 'transparent');
                    playerRef.current?.clearHighlight?.(node.id);
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

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Test Events for Node #{activeNode}</DrawerHeader>
          <DrawerBody>
            <TestEventList
              events={selectedEvents}
              testNodes={[]}
              selectedId={null}
              onSelect={(event) => {
                onClose();
                onSelectTestEvent?.(event);
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
