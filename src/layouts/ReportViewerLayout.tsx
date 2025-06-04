import {
  Flex,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useReport } from '../context/ReportContext';
import { usePage } from "../context/PageContext.tsx";
import PageViewLayout from './PageViewLayout';
import SummaryHeader from '../components/SummaryHeader.tsx';

export default function ReportViewerLayout() {
  const { report } = useReport();
  const { setPages } = usePage();

  useEffect(() => {
    if (!report) {
      return;
    }
    setPages(report.pages || []);
  }, [report, setPages]);

  if (!report) {
    return <Text color="red.500" p={6}>Error loading UI coverage report</Text>;
  }

  return (
    <Flex direction="column" height="100vh">
      <SummaryHeader />
      <PageViewLayout />
    </Flex>
  );
}
