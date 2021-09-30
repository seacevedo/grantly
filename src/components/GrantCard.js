import { useEffect, useState } from 'react';
import {
    Box, 
    Heading, 
    IconButton, 
    Button,
    NumberInput,
    NumberInputField,
    HStack, 
    VStack, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    InputRightElement,
    Spacer,
    Center} from "@chakra-ui/react";
import { BiLinkExternal } from 'react-icons/bi';
import { useGrantDonate } from '../hooks/useContract';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { ethers } from "ethers";
import Numeral from 'react-numeral';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const GrantCard = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const grantDonateContract = useGrantDonate();
    const [amountDonated, setAmountDonated] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [inputEtherValue, setInputEtherValue] = useState('');
    const handleChange = (event) => setInputEtherValue(event.target.value);

    useEffect(async () => {
        getDonationAmount(props.metadata.index);
    }, []);


    const donate = async(index, etherValue) => {
        const tx = await grantDonateContract.donate(index, { value: ethers.utils.parseEther(etherValue.toString()) });
        const receipt = await tx.wait();
        console.log(receipt);
        getDonationAmount(index);
    }


    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const getDonationAmount = async (index) => {
        const amount = await grantDonateContract.totalGrantFunds(index);
        const etherAmount = parseFloat(ethers.utils.formatEther(amount));
        setAmountDonated(etherAmount.toString());
    }


    return (
        <>
            <Box bg="gray.700" borderWidth="3px" borderRadius="md" py='1%' px='2%'>
                <HStack spacing={0}>
                    <Heading size='sm' mb='1%'>{props.metadata.title}</Heading>
                    <IconButton _hover={{ color: 'gray' }} onClick={onOpen} variant='ghost' pb="1%" icon={<BiLinkExternal/>}></IconButton>
                    <Spacer/>
                    <Heading size='sm'>{amountDonated > 0 ? <Numeral value={amountDonated * props.ethUSDRate} format={"$0,0.00"} /> : '$0.00'}{' (' + amountDonated + ' ETH)'}</Heading>
                </HStack>
                <Heading size='sm' mb='1%'>{props.metadata.authors}</Heading>
                <Heading size='sm' mb='2%'>{props.metadata.abstract}</Heading>
                <HStack>
                    <NumberInput variant="filled" size="md">
                        <NumberInputField
                            pr="76rem"
                            value={inputEtherValue}
                            onChange={handleChange}
                            placeholder="Enter Donation Amount"
                        />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={() => donate(props.metadata.index, inputEtherValue)}>
                                Donate
                            </Button>
                        </InputRightElement>
                    </NumberInput>
                </HStack>
            </Box>

            <Modal 
                onClose={onClose}
                isOpen={isOpen}
                size='xl'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={'5%'}>
                            <Box pt='5%'>
                                <Heading size='sm' pb='5%'>{'Title: ' + props.metadata.title}</Heading>
                                <Heading size='sm' pb='5%'>{'Author(s): ' + props.metadata.authors}</Heading>
                                <Heading size='sm'>{'Amount Donated: '}{amountDonated > 0 ? <Numeral value={amountDonated * props.ethUSDRate} format={"$0,0.00"} /> : '$0.00'}{' (' + amountDonated + ' ETH)' }</Heading>
                            </Box>
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
                                        file={process.env.REACT_APP_PINATA_PIN_GATEWAY_URL + props.metadata.ipfsHash}
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
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing={3} mr={'60%'}>
                            
                        </HStack>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}   

export default GrantCard;
