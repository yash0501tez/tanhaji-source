const express = require("express");
const app = express();
const cors = require("cors");
const { InMemorySigner } = require("@taquito/signer");
const { char2Bytes } = require("@taquito/utils");
const { TezosToolkit, RpcPacker } = require("@taquito/taquito");
const { Parser, packDataBytes } = require("@taquito/michel-codec");
const dotenv = require("dotenv");

dotenv.config();
const pvtKey = process.env.PVT_KEY;

const Signer = new InMemorySigner(pvtKey);

const tezos = new TezosToolkit("https://ghostnet.smartpy.io/").setProvider({
  signer: Signer,
});

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create_sign", async (req, res) => {
  const { address, amount, token_id } = req.body;

  const data = `(Pair (Pair "${address}" ${amount}) ${token_id})`;
  const type = `(pair (pair (address) (nat)) (nat))`;

  const p = new Parser();
  const dataJSON = p.parseMichelineExpression(data);
  const typeJSON = p.parseMichelineExpression(type);

  const packed = packDataBytes(dataJSON, typeJSON);
  console.log(packed);

  const signature = await Signer.sign(packed.bytes);
  console.log(signature);

  try {
    res.status(200).json({
      message: "Signature created",
      signature: signature,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating signature",
      error: err,
    });
  }
});

app.post("/create_nft_sign", async (req, res) => {
  const { address, token_id } = req.body;

  // bafkreieebbnr4xmpdj5ud3evwswbnppq6sv3tdelbw5cyldjfqz76fub3y  img link

  const p = new Parser();

  const name = "Sword NFT";
  const description = "This is a sword NFT";
  const decimals = 0;
  const artifactUri =
    "https://bafkreieebbnr4xmpdj5ud3evwswbnppq6sv3tdelbw5cyldjfqz76fub3y.ipfs.nftstorage.link/";
  const displayUri =
    "https://bafkreieebbnr4xmpdj5ud3evwswbnppq6sv3tdelbw5cyldjfqz76fub3y.ipfs.nftstorage.link/";
  const thumbnailUri =
    "https://bafkreieebbnr4xmpdj5ud3evwswbnppq6sv3tdelbw5cyldjfqz76fub3y.ipfs.nftstorage.link/";

  const nameBytes = char2Bytes(name);
  const descriptionBytes = char2Bytes(description);
  const artifactUriBytes = char2Bytes(artifactUri);
  const displayUriBytes = char2Bytes(displayUri);
  const thumbnailUriBytes = char2Bytes(thumbnailUri);

  const data = `(Pair "${address}" (Pair ${token_id} (Pair "${nameBytes}" (Pair "${descriptionBytes}" (Pair "${artifactUriBytes}" (Pair "${displayUriBytes}" "${thumbnailUriBytes}"))))))`;
  const type = `(pair (address) (pair (nat) (pair (bytes) (pair (bytes) (pair (bytes) (pair (bytes) (bytes)))))))`;

  console.log(data);

  const dataJSON = p.parseMichelineExpression(data);
  const typeJSON = p.parseMichelineExpression(type);

  const packed = packDataBytes(dataJSON, typeJSON);
  console.log(packed.bytes);

  const signature = await Signer.sign(packed.bytes);
  console.log(signature);

  try {
    res.status(200).json({
      message: "Signature created",
      signature: signature,
      data: data_bytes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating signature",
      error: error,
    });
  }
});

app.post("/create_sign_with_cid", async (req, res) => {
  const { address, token_id } = req.body;

  let ipfs_cid =
    "ipfs://bafkreiatkozctcbvb7zcfehl7ydrd3ucdg47r6cnpszelzuhqpulc2zlgq";

  const p = new Parser();
  const ipfs_cid_bytes = char2Bytes(ipfs_cid);

  console.log(ipfs_cid_bytes);

  const data = `(Pair (Pair "${address}" ${token_id}) "${ipfs_cid_bytes}")`;
  const type = `(pair (pair (address) (nat)) (bytes))`;

  const dataJSON = p.parseMichelineExpression(data);
  const typeJSON = p.parseMichelineExpression(type);

  const packed = packDataBytes(dataJSON, typeJSON);
  console.log(packed);

  const signature = await Signer.sign(packed.bytes);
  console.log(signature);

  try {
    res.status(200).json({
      message: "Signature created",
      signature: signature,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating signature",
      error: err,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
