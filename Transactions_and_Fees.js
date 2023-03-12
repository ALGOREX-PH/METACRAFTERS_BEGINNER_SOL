// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");


// Making a keypair and getting the private key
//const newPair = Keypair.generate();
//console.log(newPair);

// paste your secret that is logged here
const DEMO_FROM_SECRET_KEY = new Uint8Array(
  // paste your secret key array here
    [
        148, 245,  32, 126, 115,  91,  87, 137, 108,  28, 184,
       18, 192, 168, 159, 135, 104, 102,  52,  13,  81, 150,
       26,  88, 228, 117, 187,  87, 177, 187,   2, 244, 247,
      100,   3, 137, 226,  80, 205, 233, 202,  62,   1, 142,
        4, 179, 214,  68,   1,  50,  36,  20, 216, 152, 121,
      213,  87, 146, 109,  98, 126, 187, 206,  41
      ]            
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    // Other things to try: 
    // 1) Form array from userSecretKey
    // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
    // 2) Make a new Keypair (starts with 0 SOL)
    // const from = Keypair.generate();

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();
    const check_from_wallet = await connection.getBalance(new PublicKey(from.publicKey));
    const check_to_wallet = await connection.getBalance(new PublicKey(to.publicKey));

    console.log("Check Wallet Balances");
    console.log("From Wallet Balance : " + (parseInt(check_from_wallet) / LAMPORTS_PER_SOL) + " SOL");
    console.log("To Wallet Balance :" + (parseInt(check_to_wallet) / LAMPORTS_PER_SOL) + " SOL");

    // Aidrop 2 SOL to Sender wallet
    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );
    
    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("");
    console.log("Checking new Wallet Balance From");
    const check_from_wallet_2 = await connection.getBalance(new PublicKey(from.publicKey));
    console.log("From Wallet Balance : " + (parseInt(check_from_wallet_2) / LAMPORTS_PER_SOL) + " SOL")

    console.log("Airdrop completed for the Sender account");

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: 1 * LAMPORTS_PER_SOL
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is', signature);

    console.log("Check Wallet Balances after sending!");
    const check_from_wallet_3 = await connection.getBalance(from.publicKey);
    const check_to_wallet_2 = await connection.getBalance(to.publicKey);
    console.log("From Wallet Balance : " + (parseInt(check_from_wallet_3) / LAMPORTS_PER_SOL) + " SOL");
    console.log("To Wallet Balance : " + (parseInt(check_to_wallet_2) / LAMPORTS_PER_SOL) + " SOL");
}

transferSol();