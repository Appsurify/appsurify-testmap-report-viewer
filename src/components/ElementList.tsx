import {
  Box, Text, VStack, List, ListItem, IconButton
} from '@chakra-ui/react';
import { useSnapshot } from '../context/SnapshotContext';
import type { RRWebPlayerRef } from './RRWebPlayer';
import type {elementNode, serializedNodeWithId} from "@appsurify-testmap/rrweb-types";
import type {EnrichedNode, UICoverageAction} from "../types";
import {useSelection} from "../context/SelectionContext.tsx";
import {ExternalLinkIcon} from "@chakra-ui/icons";



interface Props {
  playerRef: React.RefObject<RRWebPlayerRef | null>;
}

// @ts-ignore
export default function ElementList({ playerRef }: Props) {
  const { snapshot } = useSnapshot();

  const { updateSelection } = useSelection();

  const totalElements = snapshot?.totalElements ?? [];
  const interactedElements = snapshot?.interactedElements ?? [];
  const actions = snapshot?.actions ?? [];
  const interactedMap = new Map<number, serializedNodeWithId>(
    interactedElements.map((el) => [el.id, el])
  );

  const totalMap = new Map<number, serializedNodeWithId>(
    totalElements.map((el) => [el.id, el])
  );

  // Получаем список уникальных node.id из объединённого множества
  const allNodeIds = new Set<number>([
    ...totalElements.map((el) => el.id),
    ...interactedElements.map((el) => el.id),
  ]);

  const nodeActionMap = new Map<number, UICoverageAction[]>();
  for (const action of actions) {
    const nodeId = action.nodeMeta?.id;
    if (nodeId !== undefined) {
      if (!nodeActionMap.has(nodeId)) {
        nodeActionMap.set(nodeId, []);
      }
      nodeActionMap.get(nodeId)!.push(action);
    }
  }

  const enrichedElements: EnrichedNode[] = Array.from(allNodeIds).map((id) => {
    const node =
      interactedMap.get(id) ?? totalMap.get(id);

    return {
      node: node!,
      actions: nodeActionMap.get(id) ?? [],
      isInteracted: interactedMap.has(id),
    };
  })
  .sort((a, b) => {
    // Сначала по isInteracted (true > false)
    if (a.isInteracted !== b.isInteracted) {
      return a.isInteracted ? -1 : 1;
    }
    // Затем по количеству actions (desc)
    return b.actions.length - a.actions.length;
  });

  if (!snapshot) {
    return <Text color="gray.500">Elements not found</Text>;
  }

  return (
    <>
      <VStack align="stretch" spacing={3}>
        <Box>

          <List spacing={2}>
            {enrichedElements.map((element) => {

              return (
                <ListItem
                  key={element.node.id}
                  onClick={() => {
                    updateSelection({ selectedElement: element });
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
                        disabled={!element.isInteracted}
                        mr={2}
                    />
                    {(element.node as elementNode).tagName}
                  </Text>
                  {element.node.selector && (
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        selector: {element.node.selector}
                      </Text>
                  )}
                  {element.node.xpath && (
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                      xpath: {element.node.xpath}
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
