import fs from 'fs-extra';
import path from 'path';

// --- CONFIGURATION ---
const TEMPLATE_DIR = path.join(__dirname, '../templates/base-template');
const RESULT_DIR = path.join(__dirname, '../result');

// --- HELPER: Extract Docs from Code ---
// This satisfies: "Auto-generate documentation from annotations in code"
function generateDocs(contractCode: string, name: string): string {
    const notices = contractCode.match(/\/\/\/ @notice (.*)/g);
    const description = notices 
        ? notices.map(n => n.replace('/// @notice ', '')).join('\n')
        : 'No description provided.';

    return `# ${name}\n\n## Overview\n${description}\n\n## Usage\n1. \`npm install\`\n2. \`npx hardhat test\``;
}

// --- CONTENT DATABASE ---
const EXAMPLES: Record<string, any> = {
    'counter': { // "Basic" Category
        contractName: 'Counter',
        contractSource: `// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
import "fhevm/lib/TFHE.sol";

/// @notice A simple encrypted counter.
/// @notice Demonstrates basic FHE arithmetic (add).
contract Counter {
    euint32 private counter;

    constructor() {
        counter = TFHE.asEuint32(0);
        TFHE.allow(counter, msg.sender);
    }

    function add(einput encryptedAmount, bytes calldata inputProof) public {
        euint32 amount = TFHE.asEuint32(encryptedAmount, inputProof);
        counter = TFHE.add(counter, amount); // FHE Addition
        TFHE.allow(counter, msg.sender);
    }
}`,
        testSource: `import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("Counter", function () {
  it("Should deploy and pass basic checks", async function () {
    const factory = await ethers.getContractFactory("Counter");
    const contract = await factory.deploy();
    await contract.waitForDeployment();
    expect(await contract.getAddress()).to.be.properAddress;
  });
});`
    },
    'input-proof': { // "Input Proof" Category
        contractName: 'InputProofDemo',
        contractSource: `// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
import "fhevm/lib/TFHE.sol";

/// @notice Demonstrates how to validate encrypted inputs.
/// @notice Securely sets values using ZK Proofs.
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
    'access-control': { // "Access Control" Category
        contractName: 'AccessControlDemo',
        contractSource: `// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;
import "fhevm/lib/TFHE.sol";

/// @notice Demonstrates managing decryption permissions.
/// @notice Uses TFHE.allow to grant view access.
contract AccessControlDemo {
    euint32 private data;
    
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

    // Argument parsing
    const args = process.argv;
    const nameIndex = args.indexOf('--name');
    
    let exampleType = null;
    if (nameIndex !== -1 && args.length > nameIndex + 1) {
        exampleType = args[nameIndex + 1];
    }

    if (!exampleType || !EXAMPLES[exampleType]) {
        console.error("❌ Error: Invalid name.");
        console.error("Available: counter, input-proof, access-control");
        process.exit(1);
    }

    const config = EXAMPLES[exampleType];
    const targetDir = path.join(RESULT_DIR, exampleType);

    console.log(`🚀 Generating ${exampleType} example...`);

    try {
        await fs.copy(TEMPLATE_DIR, targetDir);
        await fs.outputFile(path.join(targetDir, 'contracts', `${config.contractName}.sol`), config.contractSource);
        await fs.outputFile(path.join(targetDir, 'test', `${config.contractName}.ts`), config.testSource);
        
        // AUTO-DOCUMENTATION MAGIC
        const readmeContent = generateDocs(config.contractSource, config.contractName);
        await fs.outputFile(path.join(targetDir, 'README.md'), readmeContent);

        console.log(`✅ Success! Project created at: ${targetDir}`);
    } catch (err) {
        console.error("❌ Failed to create project:", err);
    }
}

main().catch(console.error);
