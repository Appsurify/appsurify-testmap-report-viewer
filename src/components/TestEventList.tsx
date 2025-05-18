import {
  Box,
  Text,
  Badge,
  useColorModeValue,
  Stepper,
  Step,
  StepSeparator,
  StepTitle,
  StepDescription,
} from '@chakra-ui/react';

import type { TestEvent } from '../types';
import {truncateArgs} from "../utils";

export interface TestEventListProps {
  events: TestEvent[];
  testNodes?: any[];
  selectedId: string | null;
  onSelect?: (testEvent: TestEvent) => void;
}

export default function TestEventList({ events, selectedId, onSelect }: TestEventListProps) {
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const getStateColor = (state: string): string => {
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


  const testEvents = events
  // @ts-ignore
  .filter((e) => e.type === 5)
  .map((e) => ({
    // @ts-ignore
    ...e,
    // @ts-ignore
    id: e.data.payload.id ?? e.id,
    // @ts-ignore
    timestamp: e.timestamp,
    // @ts-ignore
    state: e.data.payload.state ?? 'unknown',
    // @ts-ignore
    name: e.data.payload.name ?? 'Unnamed',
    // @ts-ignore
    args: e.data.payload.args ?? [],
  }));

  const activeIndex = testEvents.findIndex((e) => e.id === selectedId);
  // const { step } = useSteps({ index: activeIndex });

  if (!testEvents.length) {
    return <Text color="gray.500">Test events not found</Text>;
  }

  return (
    <Box>
      <Stepper orientation="vertical" index={activeIndex}>
        {testEvents.map((event, index) => {
          const color = getStateColor(event.state);
          const isActive = event.id === selectedId;

          return (
            <Step key={event.id} onClick={() => onSelect?.(event)} cursor="pointer">
              <Box
                border="2px solid"
                borderColor={`${color}.500`}
                bg={isActive ? `${color}.500` : 'transparent'}
                borderRadius="full"
                boxSize="1.75rem"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="bold"
                color={isActive ? 'white' : `${color}.500`}
                transition="all 0.2s"
              >
                {index + 1}
              </Box>

              <Box flexShrink={0} pl={4} py={2} bg={isActive ? hoverBg : undefined} borderRadius="md">
                <StepTitle fontSize="sm" fontWeight="medium">
                  <Badge colorScheme={color} mr={1}>{event.state}</Badge> {event.name}({truncateArgs(event.args, 10)})
                </StepTitle>
                <StepDescription fontSize="xs" color="gray.500">
                  • {Math.round(event.timestamp)} ms
                </StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
