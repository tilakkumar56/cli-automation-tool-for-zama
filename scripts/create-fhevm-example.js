const fs = require('fs-extra');
const path = require('path');

const TEMPLATE_DIR = path.join(__dirname, '../templates/base-template');
// CHANGED: Output folder is now "result"
const EXAMPLES_DIR = path.join(__dirname, '../result'); 

const EXAMPLES = {
    'input-proof': {
        contractName: 'InputProofDemo',
        contractSource: `// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
import "fhevm/lib/TFHE.sol";

contract InputProofDemo {
    euint32 private secureValue;

    function setSecureValue(einput encryptedInput, bytes calldata inputProof) public {
        secureValue = TFHE.asEuint32(encryptedInput, inputProof); 
        TFHE.allow(secureValue, msg.sender);
    }
}`,
        testSource: `import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("InputProofDemo", function () {
  it("Should deploy successfully", async function () {
    const factory = await ethers.getContractFactory("InputProofDemo");
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    expect(await contract.getAddress()).to.be.properAddress;
  });
});`
    },
    'access-control': {
        contractName: 'AccessControlDemo',
        contractSource: `// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
import "fhevm/lib/TFHE.sol";

contract AccessControlDemo {
    euint32 private data;
    
    // We use a simplified initialize function to ensure stable deployment
    function initialize(einput encryptedInput, bytes calldata inputProof) public {
        data = TFHE.asEuint32(encryptedInput, inputProof);
        TFHE.allow(data, msg.sender);
    }

    function grantAccess(address viewer) public {
        TFHE.allow(data, viewer);
    }
}`,
        testSource: `import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("AccessControlDemo", function () {
  it("Should deploy successfully", async function () {
    const factory = await ethers.getContractFactory("AccessControlDemo");
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    expect(await contract.getAddress()).to.be.properAddress;
  });
});`
    }
};

async function main() {
    console.log("DEBUG: Script started...");

    const args = process.argv;
    const nameIndex = args.indexOf('--name');
    
    let exampleType = null;
    if (nameIndex !== -1 && args.length > nameIndex + 1) {
        exampleType = args[nameIndex + 1];
    }

    if (!exampleType || !EXAMPLES[exampleType]) {
        console.error("❌ Error: Invalid name.");
        process.exit(1);
    }

    const config = EXAMPLES[exampleType];
    const targetDir = path.join(EXAMPLES_DIR, exampleType);

    console.log(`🚀 Generating ${exampleType} example in 'result' folder...`);

    try {
        await fs.copy(TEMPLATE_DIR, targetDir);
        await fs.outputFile(path.join(targetDir, 'contracts', `${config.contractName}.sol`), config.contractSource);
        await fs.outputFile(path.join(targetDir, 'test', `${config.contractName}.ts`), config.testSource);
        await fs.outputFile(path.join(targetDir, 'README.md'), `# ${config.contractName}\n\nGenerated FHEVM Example.\n\n## Usage\n\`npm install\`\n\`npx hardhat test\``);

        console.log(`✅ Success! Project created at: ${targetDir}`);
    } catch (err) {
        console.error("❌ Failed to create project:", err);
    }
}

main().catch(console.error);