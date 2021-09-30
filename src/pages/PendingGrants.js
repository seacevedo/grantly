import { useState, useEffect } from 'react';
import { Box, Container, Heading, Center, SimpleGrid, VStack } from "@chakra-ui/react"
import { ethers } from "ethers";
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { useGrantDonate, useGrantToken } from '../hooks/useContract';
import Numeral from 'react-numeral';
import GrantCard from '../components/GrantCard';

const PendingGrants = () => {

    const { library } = useWeb3React();
    const grantDonateContract = useGrantDonate();
    const grantTokenContract = useGrantToken();
    const [etherBalance, setEtherBalance] = useState(0);
    const [usdBalance, setUSDBalance] = useState(0);
    const [grantMetadata, setGrantMetadata] = useState([]);
    const [ethUSDRate, setEthUSDRate] = useState(0);


    useEffect(() => {
        if (!library || !grantDonateContract || !grantTokenContract) return;
        else {
            loadData();
        };
        const interval = setInterval(() => {
            loadData();
        }, 5000);
        return () => clearInterval(interval);
    }, [library, grantDonateContract, grantTokenContract]);


    const loadData = async () => {

        const balance = await grantDonateContract.totalAmountDonated();
        const formattedBalance = parseFloat(ethers.utils.formatEther(balance.toString()));
        setEtherBalance(formattedBalance);


        axios.get(process.env.REACT_APP_COIN_GECKO_URL).then((res) => {
            const treasuryAmount = formattedBalance * res.data.ethereum.usd;
            setEthUSDRate(res.data.ethereum.usd);
            setUSDBalance(treasuryAmount.toString());
        }).catch((error) => {
            console.log(error);
        });

        getGrants();

    }


    const getGrants = async() => {

        const promises = [];
        const tokenIndeces = [];
        const numGrants = await grantTokenContract.totalSupply();

        for(var i = numGrants-1; i >= 0; i--) {
            const tokenIndex = await grantTokenContract.tokenByIndex(i);
            const tokenURI = await grantTokenContract.tokenURI(tokenIndex);
            promises.push(axios.get(tokenURI));
            tokenIndeces.push(tokenIndex);
        }

        axios.all(promises).then(
            axios.spread((...response) => {

                const metadata = [];

                response.map(async (data, index) => {
                    data.data.index = tokenIndeces[index];
                    metadata.push(data.data);
                });

                setGrantMetadata(metadata);
            })
        ).catch((error) => {
            console.log(error);
        });

    }



    return(
        <>
            <Container maxW="container.xxl" centerContent>
                <Box width='90%' borderWidth="3px" borderRadius="lg" overflow="hidden">
                    <Center>
                        <Box p="10">
                            <VStack>
                                <Heading>
                                    Total Amount Raised
                                </Heading>
                                <Heading size="lg" letterSpacing={"tighter"}>
                                    <Numeral value={usdBalance} format={"$0,0.00"} />
                                </Heading>
                                <Heading size="md" letterSpacing={"tighter"}>
                                    {etherBalance + ' ETH'}
                                </Heading>
                            </VStack>
                        </Box>
                    </Center>
                </Box>
                <Box p='10'>
                    <Heading size="lg" letterSpacing={"tighter"}>
                        Pending Grants
                    </Heading>
                </Box>
                <Box 
                    width='90%' 
                    height='1000'
                    maxHeight='500' 
                    borderWidth="3px" 
                    borderRadius="lg" 
                    overflowY="auto"
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
                    }}>
                    <SimpleGrid columns={1} spacing={6} py='2%' px='2%' >
                        {grantMetadata.map((data) => (
                            <GrantCard metadata={data} ethUSDRate={ethUSDRate} />
                        ))}
                    </SimpleGrid>
                </Box>
            </Container>
        </>
    );
}

export default PendingGrants;