import { useState, useRef } from 'react';
import {
    FormControl,
    FormLabel,
    Container,
    Input,
    Textarea,
    Box,
    VStack,
    HStack,
    Button,
    Text,
    Center,
    Heading
} from "@chakra-ui/react";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { useGrantToken } from '../hooks/useContract';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SubmitGrants = () => {

    const imageRef = useRef();
    const { account } = useWeb3React();
    const grantTokenContract = useGrantToken();
    const [selectedFile, setSelectedFile] = useState();
    const [selectedFileURL, setSelectedFileURL] = useState('');
    const [grantName, setGrantName] = useState('');
    const [grantAbstract, setGrantAbstract] = useState('');
    const [grantAuthors, setGrantAuthors] = useState('');
    const [numPages, setNumPages] = useState(null);


    const handleGrantName = (event) => {
        setGrantName(event.target.value);
    }


    const handleGrantAbstract = (event) => {
        setGrantAbstract(event.target.value);
    }

    const handleGrantAuthors = (event) => {
        setGrantAuthors(event.target.value);
    }

    const showOpenFileDialog = () => {
        imageRef.current.click();
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleFileCapture = (event) => {
        if (event.target.files.length !== 0){
            setSelectedFile(event.target.files[0]);
            setSelectedFileURL(URL.createObjectURL(event.target.files[0]));
        }
    };

    


    const createGrantMetadata = (hash) => {

        const metadata = {
            title: grantName,
            ipfsHash: hash,
            abstract: grantAbstract,
            authors: grantAuthors,
            owner: account
        };


        return axios
            .post(process.env.REACT_APP_PINATA_PIN_JSON_URL, metadata, {
                headers: {
                    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
                }
            })
            .then(async (response) => {

                const tx = await grantTokenContract.mintToken(account, process.env.REACT_APP_PINATA_PIN_GATEWAY_URL + response.data.IpfsHash);
                const receipt = await tx.wait();
                console.log(receipt);
            
                return {
                    success: true,
                    pinataUrl: process.env.REACT_APP_PINATA_PIN_GATEWAY_URL + response.data.IpfsHash
                };
            })
            .catch((error) => {
                console.error(error);
                return {
                    success: false,
                    message: error.message,
                }
            });
    }


    const uploadGrantFile = () => {

        let data = new FormData();
        data.append('file', selectedFile);


        return axios
            .post(process.env.REACT_APP_PINATA_PIN_FILE_URL, data, {
                maxBodyLength: 'Infinity',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY
                }
            })
            .then(function (response) {
                createGrantMetadata(response.data.IpfsHash);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    const isEnabled = selectedFileURL.length > 0 && grantName.length > 0 && grantAuthors.length > 0 && grantAbstract.length > 0;


    return(

        <Container maxW="container.xl" centerContent>
            <HStack width='90%' spacing={20} mt='12'>
                <VStack width='90%' spacing={10}>
                    <Box width='100%' borderWidth="4px" borderRadius="lg" overflow="hidden">
                        <VStack spacing={8} my='6'>
                            <Text>Please Select PDF File</Text>
                            <Input
                                accept="application/pdf"
                                ref={imageRef}
                                type="file"
                                onChange={handleFileCapture}
                                hidden
                            />
                            <Button onClick={showOpenFileDialog}>Select File</Button>
                            <Text>{selectedFile ? selectedFile.name : ""}</Text>
                        </VStack>
                    </Box>
                    <FormControl id="grant-name" isRequired>
                        <FormLabel>Grant name</FormLabel>
                        <Input variant="filled" value={grantName} onChange={handleGrantName} placeholder="Grant name" />
                    </FormControl>
                    <FormControl id="grant-authors" isRequired>
                        <FormLabel>Grant authors</FormLabel>
                        <Input variant="filled" value={grantAuthors} onChange={handleGrantAuthors} placeholder="Grant authors" />
                    </FormControl>
                    <FormControl id="grant-abstract" isRequired>
                        <FormLabel>Abstract</FormLabel>
                        <Textarea variant="filled" value={grantAbstract} onChange={handleGrantAbstract} placeholder="Enter abstract here" />
                    </FormControl>
                    <Button width='100%' onClick={uploadGrantFile} isDisabled={!isEnabled}>Submit</Button>
                </VStack>
                {!selectedFile ? 
                    <Box height='650'width='100%' borderWidth="4px" borderRadius="lg" overflow="hidden">
                        <Center>
                            <Heading size="md" letterSpacing={"tighter"} pt='55%'>
                                PDF Preview
                            </Heading>
                        </Center>
                    </Box> :
                    <Box height='650' width='100%' borderWidth="4px" borderRadius="lg" overflowY="auto" overflowX="hidden"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '12px',
                            },
                            '&::-webkit-scrollbar-track': {
                                width: '6px',
                                'box-shadow': 'inset 0 0 30px grey',
                                'border-radius': '10px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'grey',
                                borderRadius: '24px',
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                                background: '#737373'
                            }
                        }}
                    >
                        <Center>
                            <Document
                                file={selectedFileURL}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                {Array.from(
                                    new Array(numPages),
                                    (el, index) => (
                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                        />
                                    ),
                                )}
                            </Document>
                        </Center>
                    </Box>
                }
            </HStack>
        </Container>
    );
}

export default SubmitGrants;