Solana Transfer Script

This script automates the process of transferring SOL and SPL tokens using the Solana blockchain. It is designed for efficient transactions and includes adjustable compute unit fees and limits.

Why I Created This Script

I had four Solana wallets that were compromised due to a scam, resulting in the loss of all my funds. These wallets were my main wallets for trading, and I was eligible to claim JUP and Pengu tokens. When I tried to claim normally from Jupiter, I was not fast enough to transfer my 1000 JUP to another safe wallet—the scammer was faster.

To prevent this from happening again, I created this script to make transactions faster and more efficient, ensuring that I could securely transfer funds before any unauthorized access could take place.

Features

Transfers SOL with configurable compute unit fees and limits.

Automatically transfers all SPL tokens held in the sender's wallet.

Uses environment variables for security.

Provides real-time feedback on wallet balances and transactions.

Prerequisites

Node.js and npm: Ensure that you have Node.js (version 14 or higher) and npm installed. You can download them from Node.js Official Website.

Git: Install Git to clone the repository from GitHub. Download it from Git Official Website.

Python: Install Python (version 3 or higher) as some dependencies may require Python during installation. Download it from Python Official Website.

Solana RPC Provider: It is recommended to use a private free RPC like Helius or QuickNode for better performance and faster transactions.

Minimum SOL Balance: Ensure that your wallet has at least 0.005 SOL to cover transaction fees.

Dependencies: The following npm packages are required:

@solana/web3.js

bs58

dotenv

@solana/spl-token

To install these dependencies, run:

npm install @solana/web3.js bs58 dotenv @solana/spl-token

Installation

Follow these detailed steps to install and run the script:

Step 1: Clone the Repository

Open your terminal and run:

git clone https://github.com/your-username/solana-transfer-script.git
cd solana-transfer-script

Step 2: Install Dependencies

Install the required npm packages:

npm install

Step 3: Install Python (if not already installed)

To check if Python is installed, run:

python --version

If Python is not installed, download and install it from Python Official Website.

Step 4: Create a .env File

Create a .env file in the root directory and add the following environment variables:

PRIVATE_KEY=your-private-key
RECIPIENT_ADDRESS=recipient-public-key
RPC_URL=https://YOUR_api-key

Replace your-private-key with your wallet's private key in Base58 format, recipient-public-key with the public key of the recipient wallet, and https://YOUR_api-key with the actual RPC URL from your provider.

Step 5: Set Up an RPC Provider

To improve speed and reliability, use a private RPC endpoint:

Sign up for a free RPC provider like Helius or QuickNode.

Get your RPC endpoint URL.


Step 6: Fund Your Wallet

Ensure your wallet has at least 0.005 SOL for transaction fees. You can check your balance using:

solana balance

If needed, deposit SOL from an exchange or another wallet.

Step 7: Run the Script

Execute the script using Node.js:

node auto-Transfer.js

What Happens?

The script fetches the SOL and SPL token balances from your wallet.

It transfers all SOL (leaving a buffer for transaction fees) to the recipient address.

It transfers all SPL tokens to the recipient address.

It repeats the process in a loop until terminated.

Notes

Ensure that your private key is stored securely and not shared publicly.

Adjust compute unit fees and limits in the script to suit your transaction needs.

Monitor your wallet balance to avoid transaction failures due to insufficient funds.

License

This project is licensed under the MIT License. See the LICENSE file for details.

Support

If you encounter any issues or have questions, feel free to open an issue on the GitHub repository or contact the project maintainer.

