import React, { useEffect, useState } from 'react';
import { injected, network } from '../connectors/connectors';
import { useWeb3React } from '@web3-react/core';

const MetamaskProvider = (props) => {
    const { active, error, activate } = useWeb3React();
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        injected
        .isAuthorized()
        .then((isAuthorized) => {
            setLoaded(true);
            if (isAuthorized && !active && !error) {
                activate(injected);
            }

            else if (!active && !error) {
                activate(network);
            }
        })
        .catch((error) => {
            console.log(error);
            setLoaded(true);
        })
    }, [activate, active, error])
    if (loaded) {
        return props.children;
    }
    return <>Loading</>;
}


export default MetamaskProvider;