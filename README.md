Markdown

# 🛡️ Zama FHEVM Example Scaffolder

> A TypeScript-based CLI automation tool that instantly scaffolds production-ready FHEVM (Fully Homomorphic Encryption) smart contract environments.

---

## 🚀 Features

This tool solves the "blank canvas" problem for FHEVM developers by generating fully configured, test-ready repositories in seconds.

- **🏭 Instant Scaffolding:** Generates a standalone Hardhat project with one command.
- **📝 Auto-Generated Documentation:** Automatically extracts `/// @notice` comments from Solidity code to build the README.
- **⚙️ Pre-Configured Environment:** Sets up `fhevm`, `typescript`, and `hardhat-toolbox` automatically.
- **📚 Built-in Categories:**
  - **Basic:** Simple encrypted counters (`TFHE.add`).
  - **Encryption:** Secure input proofs and validation.
  - **Access Control:** Managing permissions with `TFHE.allow`.

---

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/tilakkumar56/cli-automation-tool-for-zama.git](https://github.com/tilakkumar56/cli-automation-tool-for-zama.git)
   cd cli-automation-tool-for-zama
Install dependencies:

Bash

npm install
⚡ Usage Guide
The tool uses a simple CLI command npm run generate to create new projects in the result/ folder.

1. Generate a "Counter" Example (Basic)
Demonstrates basic encrypted arithmetic.

Bash

# Generate the project
npm run generate -- --name counter

# Run the generated test
cd result/counter
npm install
npx hardhat test
2. Generate an "Input Proof" Example (Encryption)
Demonstrates how to accept encrypted parameters and validate ZK proofs.

Bash

# Return to root
cd ../..

# Generate the project
npm run generate -- --name input-proof

# Run the generated test
cd result/input-proof
npm install
npx hardhat test
3. Generate an "Access Control" Example (Permissions)
Demonstrates restricting data visibility using TFHE.allow.

Bash

# Return to root
cd ../..

# Generate the project
npm run generate -- --name access-control

# Run the generated test
cd result/access-control
npm install
npx hardhat test
📂 Project Structure
The tool follows a "Factory Pattern" to assemble projects dynamically:

Plaintext

├── scripts/
│   └── create-fhevm-example.ts   # 🧠 The Factory: Typescript automation logic
├── templates/
│   └── base-template/            # 🦴 The Skeleton: Standard Hardhat config & tsconfig
├── result/                       # 📦 The Output: Generated projects appear here
└── package.json                  # 🔧 Config: scripts and dependencies
