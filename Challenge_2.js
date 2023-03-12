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

const wallet_2_secret_key = new Uint8Array(
    [
        136, 250, 149, 121, 194, 144, 229, 228, 150, 200,
      218, 221, 192, 246, 136, 155,  18, 146, 169, 185,
      186,  53, 103, 119, 240,  34, 112, 235,  26, 110,
      180, 189,  24, 243,  32, 168, 203, 230, 240, 166,
      156,  99, 143,  70, 150, 157, 114,  79, 179, 134,
      126, 207,  49, 162,  44,  67,  84,  40,  47, 172,
       86,  62,   8, 132
    ]
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
    var to = Keypair.fromSecretKey(wallet_2_secret_key);
    // Other things to try: 
    // 1) Form array from userSecretKey
    // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
    // 2) Make a new Keypair (starts with 0 SOL)
    // const from = Keypair.generate();

    // Generate another Keypair (account we'll be sending to)

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
    const check_to_wallet = await connection.getBalance(new PublicKey(to.publicKey));

    console.log("Airdrop completed for the Sender account");
    var to_fifty_percent = (parseInt(check_to_wallet) / LAMPORTS_PER_SOL) * 0.5;
    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: to_fifty_percent * LAMPORTS_PER_SOL
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