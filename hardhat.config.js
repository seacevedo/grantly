require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/8fd146ee992e4360b83c46e7c8166c58", //Infura url with projectId
      accounts: [process.env.REACT_APP_PRIVATE_KEY] // add the account that will deploy the contract (private key)
    },
  }
};
