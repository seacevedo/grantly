import GrantDonate from '../abis/GrantDonate.json';
import GrantToken from '../abis/GrantToken.json';
import { getContract } from '../utils/ethers_utils.js';
import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';

const useContract = (address, abi) => {
    const { library, account } = useWeb3React();
    return useMemo(() => {
        try {
            return getContract(address, abi, library, account)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [library, account, abi, address]);
}

export const useGrantDonate = () => {
    return useContract(process.env.REACT_APP_GRANT_DONATE_ADDRESS, GrantDonate.abi);
}

export const useGrantToken = () => {
    return useContract(process.env.REACT_APP_GRANT_TOKEN_ADDRESS, GrantToken.abi);
}
