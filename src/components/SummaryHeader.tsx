import {
  Box,
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  useColorModeValue,
  Text,
  Badge,
} from '@chakra-ui/react';
import { useReport } from '../context/ReportContext';

export default function SummaryHeader() {
  const { report } = useReport();

  const bg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!report) return null;

  const pages = report.pages ?? [];
  const totalPages = pages.length;

  const coverageValues = pages.map((p) => p.coverageInfo.percentage ?? 0);
  const totalCoverage = coverageValues.reduce((sum, val) => sum + val, 0);
  const avgCoverage = totalPages > 0 ? (totalCoverage / totalPages).toFixed(1) : '0';
  const minCoverage = coverageValues.length > 0 ? Math.min(...coverageValues).toFixed(1) : '0';
  const maxCoverage = coverageValues.length > 0 ? Math.max(...coverageValues).toFixed(1) : '0';

  return (
    <Box
      borderBottom="1px solid"
      borderColor={borderColor}
      bg={bg}
      px={6}
      py={4}
      mb={4}
    >
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="start" gap={4}>
        <Box>
          <Heading as="h2" size="md" mb={1}>
            Test Report
            <Badge
                ml={2}
                colorScheme={report.test?.state === 'passed' ? 'green' : 'red'}
            >
              {report.test?.state}
            </Badge>
          </Heading>
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="start" gap={4}>
            <Box flex="1">
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                TestSuite: {report.suite?.title || ''}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                TestCase: {report.test?.title || ''}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Spec: {report.spec?.name || ''}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Duration: {report.test?.duration || 'unknown'} ms
              </Text>

            </Box>

            <Box flexShrink={0}>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Browser: {report.browser?.displayName || 'unknown'} {report.browser?.version || 'unknown'}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Runner: {report.runner?.source || 'unknown'}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Type: {report.runner?.type || 'unknown'}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                Version: {report.runner?.version || 'unknown'}
              </Text>
              {report.runner?.recorder?.scriptVersion && (
                <Text fontSize="sm" color="gray.500" noOfLines={1}>
                  Recorder: {report.runner.recorder.scriptVersion}
                </Text>
              )}
            </Box>
          </Flex>
        </Box>

        <StatGroup>
          <Stat>
            <StatLabel>Pages</StatLabel>
            <StatNumber>{totalPages}</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Avg. Coverage</StatLabel>
            <StatNumber>{avgCoverage}%</StatNumber>
            <StatHelpText>
              Min: {minCoverage}%, Max: {maxCoverage}%
            </StatHelpText>
          </Stat>
        </StatGroup>
      </Flex>
    </Box>
  );
}
