# 🛡️ Zama FHEVM Example Factory

> A CLI automation tool that instantly scaffolds production-ready FHEVM (Fully Homomorphic Encryption) smart contract environments.

---

## 🎥 Video Demo

**[👉 https://youtu.be/1LUM5icC1Hs ]**

---

## 🚀 Features

This tool solves the "blank canvas" problem for FHEVM developers by generating fully configured, test-ready repositories in seconds.

- **🏭 Instant Scaffolding:** Generates a standalone Hardhat project with one command.
- **⚙️ Pre-Configured Environment:** Automatically sets up `fhevm`, `typescript`, and `hardhat-toolbox`.
- **🧪 Auto-Generated Tests:** Writes passing tests that verify FHE logic (Encryption -> Computation -> Decryption).
- **📚 Built-in Patterns:** Includes templates for:
  - **Input Proofs:** Securely validating encrypted user inputs.
  - **Access Control:** Managing decryption permissions (`TFHE.allow`).

---

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/tilakkumar56/cli-automation-tool-for-zama.git](https://github.com/tilakkumar56/cli-automation-tool-for-zama.git)
   cd cli-automation-tool-for-zama

2. Install dependencies:

   npm install

⚡ Usage Guide
1. Generate an "Input Proof" Example
This example demonstrates how to accept encrypted parameters from a user and validate the ZK proof on-chain.

# Run the generator
node scripts/create-fhevm-example.js --name input-proof

# Navigate to the generated project
cd result/input-proof

# Install dependencies and run the test
npm install
npx hardhat test

2. Generate an "Access Control" Example
This example shows how to restrict data visibility and grant decryption permissions to specific users using TFHE.allow.

# Return to root (if inside another folder)
cd ../..

# Run the generator
node scripts/create-fhevm-example.js --name access-control

# Test the generated logic
cd result/access-control
npm install
npx hardhat test

📂 Project Structure
The tool uses a "Factory Pattern" to assemble projects:

├── scripts/
│   └── create-fhevm-example.js   # 🧠 The Logic: Parses CLI args & generates code
├── templates/
│   └── base-template/            # 🦴 The Skeleton: Standard Hardhat config & tsconfig
├── result/                       # 📦 The Output: Generated projects appear here
└── README.md

   
