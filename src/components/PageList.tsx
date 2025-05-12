import {
  VStack,
  Box,
  useColorModeValue,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
} from '@chakra-ui/react';
import { usePage } from '../context/PageContext';

export default function PageList() {
  const { page, setPage, pages } = usePage();

  const selectedBg = useColorModeValue('blue.50', 'blue.600');
  const selectedText = useColorModeValue('blue.700', 'white');
  const fallbackText = useColorModeValue('gray.500', 'gray.400');

  return (
    <VStack align="stretch" spacing={2}>
      {pages.map((p) => {
        const isSelected = page?.id === p.id;
        const url = new URL(p.href);
        const coverage = p.stats?.uniqueInteractionCoveragePercent ?? 0;
        const arrowType = coverage > 10 ? 'increase' : 'decrease';
        const total = p.stats?.totalVisibleInteractiveNodes ?? 0;
        const interacted = p.stats?.uniqueInteractedInteractiveNodes ?? 0;

        return (
          <Tooltip key={p.id} label={p.href} placement="right">
            <Box
              p={2}
              borderRadius="md"
              bg={isSelected ? selectedBg : 'transparent'}
              cursor="pointer"
              onClick={() => setPage(p)}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
            >
              <Stat color={isSelected ? selectedText : undefined}>
                <StatLabel isTruncated fontSize="xs">{url.host}</StatLabel>
                <StatNumber
                  color={fallbackText}
                  noOfLines={1}
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  {url.pathname}
                </StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type={arrowType} />
                  {coverage.toFixed(1)}% • {interacted}/{total} interactive
                </StatHelpText>
                <Text fontSize="xs" color={fallbackText}>
                  Snapshots: {p.snapshots.length}
                </Text>
              </Stat>
            </Box>
          </Tooltip>
        );
      })}
    </VStack>
  );
}
