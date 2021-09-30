import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';



// 31337 is default chainId from hardhat
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 31337] });

export const network = new NetworkConnector({
    urls: {
        4: process.env.REACT_APP_INFURA_URL,
    },
    defaultChainId: 4,
    pollingInterval: 12000
});
