import {
    Container,
    VStack,
} from '@chakra-ui/react';
import {useReport} from './context/ReportContext.tsx';
import UploadArea from './components/UploadArea.tsx';
import ReportViewerLayout from './layouts/ReportViewerLayout.tsx';


function App() {
    const report = useReport();

    return (
        <VStack>
            <Container minWidth='max-content'>

            {!report.report ? ( <UploadArea /> ) : ( <ReportViewerLayout /> )}

            </Container>
        </VStack>
    );
}

export default App;
