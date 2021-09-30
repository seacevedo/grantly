import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';



// 31337 is default chainId from hardhat
export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 31337] });

export const network = new NetworkConnector({
    urls: {
        4: 'https://rinkeby.infura.io/v3/8fd146ee992e4360b83c46e7c8166c58',
    },
    defaultChainId: 4,
    pollingInterval: 12000
});
