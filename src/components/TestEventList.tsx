import {
  VStack,
  List,
  ListItem,
  Text,
  Badge,
  Box,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import type {RRWebNode, TestEvent} from '../types';

export interface TestEventListProps {
  testEvents: TestEvent[];
  testNodes?: RRWebNode[],
  selectedId: string | null;
  onSelect?: (testEvent: TestEvent) => void;
}

export default function TestEventList({ testEvents, testNodes, selectedId, onSelect }: TestEventListProps) {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'passed':
        return 'green';
      case 'failed':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  if (!testEvents?.length) {
    return <Text color="gray.500">Test events not found</Text>;
  }

  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <VStack align="stretch" spacing={2}>
      <List spacing={1}>
        {testEvents.map((event) => {
          const isSelected = selectedId === event.id;
          const rrwebNodes = Array.from(
            new Map(
              testNodes
                        ?.filter(n => n.testEventId === event.id)
                        .map(n => [n.id, n]) // ключ — id, значение — сам узел
                    )?.values() || []
                  );

          return (
            <ListItem
              key={event.id}
              p={2}
              borderRadius="md"
              bg={isSelected ? hoverBg : undefined}
              _hover={{ bg: hoverBg }}
              cursor="pointer"
              onClick={() => onSelect?.(event)}
            >
              <Box>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                  <Badge colorScheme={getStateColor(event.state)}>{event.state}</Badge> {event.name}  ({event.args.join(', ')})
                </Text>
                <HStack spacing={2} fontSize="xs" color="gray.500">
                  <Text>{event.timestamp}</Text>
                  {rrwebNodes?.length ? (
                    <Text>
                      ↳ {rrwebNodes.map(n => `${n.tagName} #${n.id}`).join(', ')}
                    </Text>
                  ) : null}
                </HStack>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </VStack>
  );
}
