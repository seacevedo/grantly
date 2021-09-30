import { ethers } from "ethers";

const isAddress = (value) => {
    try {
        return ethers.utils.getAddress(value);
    } catch {
        return false;
    }
}

const getSigner = (library, account) => {
    return library.getSigner(account).connectUnchecked();
}

const getProviderOrSigner = (library, account) => {
    return account ? getSigner(library, account) : library;
}

export const getContract = (address, abi, library, account) => {


    if (!isAddress(address) || address === ethers.constants.AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new ethers.Contract(address, abi, getProviderOrSigner(library, account));
}
