import {Box, Flex, Text, useColorModeValue} from '@chakra-ui/react';
import { useEffect } from 'react';
import { usePage } from '../context/PageContext';
import { useSnapshot } from '../context/SnapshotContext';
import PageList from './PageList';
import SnapshotViewLayout from "./SnapshotViewLayout.tsx";

export default function PageViewLayout() {
  const { page, pages, setPage } = usePage();
  const { setSnapshot, setSnapshots } = useSnapshot();

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bg = useColorModeValue('gray.50', 'gray.800');

  useEffect(() => {
      if (!page) {
          setPage(pages[0]);
      }
    if (page) {
      setSnapshots(page.snapshots);
      setSnapshot(null);
    }
  }, [page, pages, setPage, setSnapshot, setSnapshots]);

  if (!page) {
    return <Text color="red.500" p={6}>Page not selected</Text>;
  }

  return (
    <Flex flex="1" overflow="hidden">
      {/* COLUMN: PAGES */}
      <Box
        width="220px"
        borderRight="1px solid"
        borderColor={borderColor}
        p={4}
        overflowY="auto"
        bg={bg}
      >
        <PageList />
      </Box>

     {/* COLUMN: Snapshot View Layout */}
      <Box
        borderRight="1px solid"
        borderColor={borderColor}
        p={4}
        overflowY="auto"
      >

          <SnapshotViewLayout />


      </Box>



    </Flex>
  );
}
