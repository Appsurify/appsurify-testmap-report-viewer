import {
  Box,
  VStack,
  Text,
  Icon,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import { useReport } from '../context/ReportContext';
import { Report } from '../report';

export default function UploadArea() {
  const { setReport } = useReport();
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'gray.700');
  const border = useColorModeValue('gray.300', 'gray.600');

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const report = Report.fromRaw(json);
        if (!Array.isArray(report.pages)) {
          throw new Error('Invalid report structure.');
        }
        setReport(report);
        toast({
          title: 'Report loaded',
          description: file.name,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: 'Failed to load file',
          description: (err as Error).message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: { 'application/json': ['.json'] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) handleFile(acceptedFiles[0]);
    },
  });

  return (
    <Box
      {...getRootProps()}
      border="2px dashed"
      borderColor={border}
      bg={bg}
      p={10}
      borderRadius="lg"
      textAlign="center"
      cursor="pointer"
    >
      <input {...getInputProps()} />
      <VStack spacing={4}>
        <Icon as={FiUpload} boxSize={10} color="gray.400" />
        <Text fontSize="lg" color="gray.600">
          Drop file to upload
        </Text>
        <Text fontSize="sm" color="gray.500">
          or
        </Text>
        <Button onClick={open} colorScheme="blue">
          Select file
        </Button>
      </VStack>
      <Text fontSize="xs" mt={6} color="gray.400">
        Only JSON files generated by UI coverage plugin are supported.
      </Text>
    </Box>
  );
}
