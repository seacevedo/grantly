import { Link } from "react-router-dom";
import makeBlockie from 'ethereum-blockies-base64';
import { Flex, Spacer, Button, Heading, HStack, Avatar, Tabs, Tab } from "@chakra-ui/react";
import { useWeb3React } from '@web3-react/core';



const PageNavbar = (props) => {


    const { account } = useWeb3React();

    return (
        <Flex padding={6}>
            <Flex align="center">
                <Heading size="lg" letterSpacing={"tighter"}>
                    {props.title}
                </Heading>
            </Flex>
            <Spacer />
            <Tabs variant="soft-rounded" colorScheme="whiteAlpha">
                <HStack alignItems="center" mr={8} spacing="10px">
                    <Link to='/'>
                        <Tab>Pending Grants</Tab>
                    </Link>
                    <Link to='/funded_grants'>
                        <Tab>Funded Grants</Tab>
                    </Link>
                    <Link to='/submit_grants'>
                        <Tab>Submit Grant</Tab>
                    </Link>
                </HStack>
            </Tabs>
            {account ? <Button mr='10px' rightIcon={<Avatar ml='5px' src={makeBlockie(account)} size='xs' />} borderWidth="2px" variant="outline">{account.substr(0, 6) + '...' + account.substr(-4)}</Button> :
                <Button variant="outline" borderWidth="2px" onClick={() => props.onClick()}>Connect</Button> }

        </Flex>
    );
}


export default PageNavbar;