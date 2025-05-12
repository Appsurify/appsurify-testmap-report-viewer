import {
  Flex,
  Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useReport } from '../context/ReportContext';
import { usePage } from "../context/PageContext.tsx";
import PageViewLayout from './PageViewLayout';
import SummaryHeader from "./SummaryHeader.tsx";

export default function ReportViewerLayout() {
  const { report } = useReport();
  const { setPages } = usePage();

  const bg = useColorModeValue('gray.50', 'gray.800');
  // const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Инициализация первой страницы и первого снимка
  useEffect(() => {
    if (!report) {
      return;
    }
    setPages(report.pages || []);
  }, [report, setPages]);

  // Пока данные не готовы — просто сообщение
  if (!report) {
    return <Text color="red.500" p={6}>Данные отчета не загружены полностью.</Text>;
  }

  return (
    <Flex direction="column" height="100vh" bg={bg}>
      {/* HEADER */}
      {/*<Box p={4} borderBottom="1px solid" borderColor={borderColor}>*/}
      {/*  <VStack align="start" spacing={1}>*/}
      {/*    <Heading size="md">{report.spec.name}</Heading>*/}
      {/*    <HStack>*/}
      {/*      <Text fontWeight="medium">{report.test.fullTitle}</Text>*/}
      {/*      <Badge colorScheme={report.test.state === 'passed' ? 'green' : 'red'}>*/}
      {/*        {report.test.state}*/}
      {/*      </Badge>*/}
      {/*    </HStack>*/}
      {/*  </VStack>*/}
      {/*</Box>*/}
      <SummaryHeader />
      {/* Page layout */}
      <PageViewLayout />
    </Flex>
  );
}
