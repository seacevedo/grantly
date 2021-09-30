import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from "ethers";
import MetamaskProvider from './components/MetamaskProvider';

const darkTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
  },
});

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  return library;
}


ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={darkTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MetamaskProvider>
          <App />
        </MetamaskProvider>
      </Web3ReactProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
