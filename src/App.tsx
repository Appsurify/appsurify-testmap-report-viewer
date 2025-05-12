import {
    Container, Heading, Text, VStack,
} from '@chakra-ui/react';
import {useReport} from "./context/ReportContext.tsx";
import UploadArea from "./components/UploadArea.tsx";
import ReportViewerLayout from "./components/ReportViewerLayout.tsx";


function App() {
    const report = useReport();

    return (
        <VStack>
            <Heading>
                <Text>UI Coverage report viewer</Text>
            </Heading>

            <Container
                border={'1px'} borderColor='gray.200'
                minWidth='max-content'
            >
            {!report.report ? (
              <UploadArea />
            ) : (
              <ReportViewerLayout />
            )}

            </Container>


        </VStack>
    );
}

export default App;
