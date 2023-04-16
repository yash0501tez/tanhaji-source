const express = require("express");
const app = express();
const cors = require("cors");
const { InMemorySigner } = require("@taquito/signer");
const { char2Bytes } = require("@taquito/utils");
const { TezosToolkit, RpcPacker } = require("@taquito/taquito");
const {
  Parser,
  packDataBytes,
  unpackDataBytes,
  unpackData,
} = require("@taquito/michel-codec");
const dotenv = require("dotenv");

dotenv.config();
const pvtKey = process.env.PVT_KEY;
const PORT = process.env.PORT || 3000;

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

app.post("/test", async (req, res, next) => {
  let ipfs_cid =
    "https://bafkreiatkozctcbvb7zcfehl7ydrd3ucdg47r6cnpszelzuhqpulc2zlgq.ipfs.dweb.link/";

  const p = new Parser();

  const data = `"${ipfs_cid}"`;
  const type = `(bytes)`;

  const dataJSON = p.parseMichelineExpression(data);
  const typeJSON = p.parseMichelineExpression(type);

  const packed = packDataBytes(dataJSON, typeJSON);
  console.log(packed.bytes);

  const unpack = unpackDataBytes(packed, typeJSON);
  console.log(unpack);

  const signature = await Signer.sign(packed.bytes);
  console.log(signature);

  try {
    res.status(200).json({
      message: "Signature created",
      signature: signature,
      data: unpack,
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
    "ipfs://bafkreihe22yv4famkrjvklf6cjap243xu22cyugjvxacryath3zbmoeicu";

  const p = new Parser();

  let created_at = Date.now();

  const data = `(Pair "${address}" (Pair "${ipfs_cid}" "${created_at}"))`;
  const type = `(pair (address) (pair (string) (timestamp)))`;

  const dataJSON = p.parseMichelineExpression(data);
  const typeJSON = p.parseMichelineExpression(type);

  const packed = packDataBytes(dataJSON, typeJSON);
  console.log(packed);

  const unpackedData = unpackDataBytes(packed, typeJSON);
  console.log(unpackedData);

  const signature = await Signer.sign(packed.bytes);
  console.log(signature);

  try {
    res.status(200).json({
      message: "Signature created",
      signature: signature,
      unpacked: unpackedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating signature",
      error: err,
    });
  }
});

app.post("/create_sign_with_tsp", async (req, res) => {
  const { address, token_id } = req.body;

  let ipfs_cid =
    "ipfs://bafkreihe22yv4famkrjvklf6cjap243xu22cyugjvxacryath3zbmoeicu";

  // const ipfs_cid_bytes = char2Bytes(ipfs_cid);
  // console.log(ipfs_cid_bytes);

  const p = new Parser();

  // const timestamp =
  // get current timestamp via date.now

  const timestamp = Date.now();

  console.log(timestamp);

  const data = `(Pair "${address}" (Pair ${token_id} (Pair "${ipfs_cid}" ${timestamp})))`;
  const type = `(pair (address) (pair (nat) (pair (string) (timestamp))))`;

  // const data = `(Pair (Pair "${address}" "${ipfs_cid}") ${token_id})`;
  // const type = `(pair (pair (address) (bytes)) (nat))`;

  const dataJSON = p.parseMichelineExpression(data);
  const typeJSON = p.parseMichelineExpression(type);

  const packed = packDataBytes(dataJSON, typeJSON);
  console.log(packed);

  // const idx = packed.bytes.indexOf("01000000");
  // console.log(idx);

  // console.log(packed.bytes.charAt(idx + 1));

  // const newBytes =
  //   packed.bytes.slice(0, idx + 1) + "a" + packed.bytes.slice(idx + 2);

  // console.log(newBytes);

  // const newPack = {
  //   bytes: newBytes,
  // };

  // console.log(newPack);

  // const unpackedData = unpackData(
  //   "0507070a000000160000fadcd216de7817afb85f7f7a39510e2ed2243032070700000a00000042697066733a2f2f6261666b72656961746b6f7a637463627662377a636665686c3779647264337563646734377236636e70737a656c7a75687170756c63327a6c6771",
  //   typeJSON,
  // );

  // const data2 = {
  //   bytes:
  //     "0507070a000000160000fadcd216de7817afb85f7f7a39510e2ed2243032070700b7460a00000042697066733a2f2f6261666b726569656562626e7234786d70646a357564336576777377626e707071367376337464656c62773563796c646a66717a37366675623379",
  // };

  const unpackedData = unpackDataBytes(packed, typeJSON);
  console.log(unpackedData);

  const signature = await Signer.sign(packed.bytes);
  console.log(signature);

  try {
    res.status(200).json({
      message: "Signature created",
      signature: signature,
      unpacked: unpackedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error creating signature",
      error: err,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
