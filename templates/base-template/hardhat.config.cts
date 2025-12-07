import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    zama: {
      url: "https://devnet.zama.ai",
      accounts: [], 
      chainId: 8009,
    },
  },
};

export default config;