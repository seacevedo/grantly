require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    rinkeby: {
      url: process.env.REACT_APP_INFURA_URL, //Infura url with projectId
      accounts: [process.env.REACT_APP_PRIVATE_KEY] // add the account that will deploy the contract (private key)
    },
  }
};
