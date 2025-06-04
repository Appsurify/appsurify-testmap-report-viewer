import { HStack, Button, Text, Icon } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useSnapshot } from '../context/SnapshotContext';
import { useMemo, useEffect } from 'react';

export default function SnapshotNavigator() {
    const { snapshot, setSnapshot, snapshots } = useSnapshot();
    useEffect(() => {
        if (!snapshot) {
            setSnapshot(snapshots[0]);
        }
    }, [snapshot, setSnapshot, snapshots]);



    const currentIndex = useMemo(() => {
        return snapshots.findIndex((s) => s.id === snapshot?.id);
    }, [snapshots, snapshot]);

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < snapshots.length - 1;

    const goTo = (offset: number) => {
        const target = snapshots[currentIndex + offset];
        if (target) setSnapshot(target);
    };

  return (
    <HStack spacing={4} justify="center" mb={2}>
      <Button
        onClick={() => goTo(-1)}
        leftIcon={<Icon as={ChevronLeftIcon} />}
        isDisabled={!canGoPrev}
        size="sm"
        variant="outline"
      >
        Prev
      </Button>

      <Text fontSize="sm" minW="120px" textAlign="center">
        Snapshot {currentIndex + 1} of {snapshots.length}
      </Text>

      <Button
        onClick={() => goTo(1)}
        rightIcon={<Icon as={ChevronRightIcon} />}
        isDisabled={!canGoNext}
        size="sm"
        variant="outline"
      >
        Next
      </Button>
    </HStack>
  );
}
