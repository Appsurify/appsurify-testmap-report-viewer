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

interface Props {
  playerRef: React.RefObject<RRWebPlayerRef | null>;
}

export default function InteractiveNodeList({ playerRef }: Props) {
  const { snapshot } = useSnapshot();
  const nodes = snapshot?.visibleInteractiveNodes ?? [];
  const rrwebNodes = snapshot?.rrwebNodes ?? [];

  const greenColor = 'rgba(0, 255, 0, 0.3)';
  const redColor = 'rgba(255, 0, 0, 0.3)';

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
            const color = tested ? greenColor : redColor;

            return (
              <ListItem
                key={node.id}
                p={2}
                borderLeft="4px solid"
                borderColor={tested ? 'green.200' : 'red.200'}
                bg={tested ? 'green.50' : 'red.50'}
                borderRadius="md"
                _hover={{ opacity: 0.9 }}
                onMouseEnter={() => playerRef.current?.highlightNode(node.id, color)}
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
