import {
  Box, Text, VStack, List, ListItem, IconButton
} from '@chakra-ui/react';
import { useSnapshot } from '../context/SnapshotContext';
import type { RRWebPlayerRef } from './RRWebPlayer';
import type {elementNode} from '@appsurify-testmap/rrweb-types';

import {useSelection} from '../context/SelectionContext.tsx';
import {ExternalLinkIcon} from '@chakra-ui/icons';



interface Props {
  playerRef: React.RefObject<RRWebPlayerRef | null>;
}

// @ts-ignore
export default function ElementList({ playerRef }: Props) {
  const { snapshot } = useSnapshot();

  const { updateSelection } = useSelection();

  if (!snapshot) {
    return <Text color="gray.500">Elements not found</Text>;
  }

  const findCorrespondingAction = (elementId: number) => {
    return snapshot.actions.find(action => action.elementId === elementId);
  };

  return (
    <>
      <VStack align="stretch" spacing={3}>
        <Box>
          <List spacing={2}>
            {snapshot.elements.filter(e => e.isVisible && e.isInteractive).map((element) => {
              const correspondingAction = findCorrespondingAction(element.id);

              return (
                <ListItem
                  key={element.id}
                  onClick={() => {
                    // При клике на элемент списка - только выделение элемента
                    updateSelection({
                      selectedElement: element,
                      selectedAction: null
                    });
                  }}
                  p={2}
                  borderLeft="4px solid"
                  borderColor={element.isInteracted ? 'green.200' : 'red.200'}
                  bg={element.isInteracted ? 'green.50' : 'red.50'}
                  borderRadius="md"
                  cursor={element.isInteracted ? 'pointer' : 'default'}
                >
                  <Text fontSize="sm" fontWeight="medium">
                    <IconButton
                        size='xs'
                        aria-label='open actions'
                        icon={<ExternalLinkIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (correspondingAction) {
                            updateSelection({
                              selectedElement: element,
                              selectedAction: correspondingAction
                            });
                          }
                        }}
                        isDisabled={!element.isInteracted || !correspondingAction}
                        mr={2}
                    />
                    {(element as elementNode).tagName}
                  </Text>
                  {element.selector && (
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        selector: {element.selector}
                      </Text>
                  )}
                  {element.xpath && (
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                      xpath: {element.xpath}
                    </Text>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </VStack>
    </>
  );
}
