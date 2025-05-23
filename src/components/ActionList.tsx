import {
  Box,
  Text,
  Stepper,
  Step,
  StepSeparator,
  StepTitle,
  StepDescription, StepIndicator, StepStatus, StepIcon
} from '@chakra-ui/react';

import type { UICoverageAction } from '../types';
import {useSelection} from "../context/SelectionContext.tsx";

export interface ActionListProps {
  actions: UICoverageAction[];
  onSelect?: (action: UICoverageAction) => void;
}

export default function ActionList({ actions, onSelect }: ActionListProps) {

  const { selection, updateSelection } = useSelection();
  const activeIndex = actions.findIndex((e) => e.id === selection.selectedAction?.id);

  if (!actions.length) {
    return <Text color="gray.500">Test events not found</Text>;
  }

  return (
    <Box>
      <Stepper orientation="vertical" index={activeIndex}>
        {actions.map((action, index) => (
          <Step
              key={index}
              onClick={() => {

                updateSelection({
                  selectedAction: action,
                  // @ts-ignore
                  selectedElement: action.nodeMeta?.id !== selection.selectedElement?.id ? null : selection.selectedElement });
                onSelect?.(action);
              }}
              cursor="pointer"
          >
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}

              />
            </StepIndicator>

            <Box flexShrink={0} pl={4} py={2} borderRadius="md">
              <StepTitle fontSize="sm" fontWeight="medium">{action.action}({action.value})</StepTitle>
              <StepDescription fontSize="xs" color="gray.500">{new Date(action.timestamp).toLocaleTimeString()}</StepDescription>
            </Box>

            <StepSeparator />

          </Step>

        ))}

      </Stepper>
    </Box>
  );
}
