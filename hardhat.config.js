require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/8fd146ee992e4360b83c46e7c8166c58", //Infura url with projectId
      accounts: ["d95610817c7ef2549aafa89f40053612f60e1f152daf7ca60ebe362e55392880"] // add the account that will deploy the contract (private key)
    },
  }
};
