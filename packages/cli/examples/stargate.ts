import { makeCosmoshubPath } from "@cosmjs/amino";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, calculateFee, GasPrice, SigningStargateClient } from "@cosmjs/stargate";

// Wallet
const mnemonic =
  "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone";
const path = makeCosmoshubPath(3);
const prefix = "cosmos";
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { hdPaths: [path], prefix: prefix });
const [account] = await wallet.getAccounts();
console.log("Signer address:", account.address);

// Network config
const rpcEndpoint = "ws://localhost:26658";
const gasPrice = GasPrice.fromString("0.025ucosm");

// Setup client
const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);

// Send transaction
const recipient = "cosmos1xv9tklw7d82sezh9haa573wufgy59vmwe6xxe5";
const amount = {
  denom: "ucosm",
  amount: "1234567",
};
const fee = calculateFee(200_000, gasPrice);
const result = await client.sendTokens(
  account.address,
  recipient,
  [amount],
  fee,
  "Have fun with your star coins",
);
assertIsBroadcastTxSuccess(result);
console.log("Successfully broadcasted:", result);

client.disconnect();