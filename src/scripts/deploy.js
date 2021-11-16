const hre = require("hardhat");
const fs = require("fs");
const bs58 = require("bs58");
const ERC20ABI = require("@openzeppelin/contracts/build/contracts/ERC20.json");

async function main() {
    // Contract parameters
    const MINT_FEE_PER_TOKEN = 10;
    const MAX_TOKENS = 1000;
    const URI = "";
    const EARLY_MINT_END = Math.floor((Date.now() + 3.6e6) / 1000);
    // const ORACLE = "0x0bDDCD124709aCBf9BB3F824EbC61C87019888bb";
    // const JOB_ID = hre.ethers.utils.id("c6a006e4f4844754a6524445acde84a0");
    // const LINK_FEE = (0.1e18).toString();
    // const API_URL = "https://lazy-nft.herokuapp.com/generate";
    const LINK_ADDRESS = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";

    // Compile and deploy the contract
    await hre.run("compile");
    // const Icons = await hre.ethers.getContractFactory("Icons");
    const Icons = await hre.ethers.getContractFactory("APIConsumer");
    // const icons = await Icons.deploy(MINT_FEE_PER_TOKEN, MAX_TOKENS, URI, EARLY_MINT_END, ORACLE, JOB_ID, LINK_FEE, API_URL, LINK_ADDRESS);
    // const icons = await Icons.deploy(MINT_FEE_PER_TOKEN, MAX_TOKENS, URI, EARLY_MINT_END, LINK_ADDRESS);
    const exampleUri = "QmcPYGnhRrumj8WGSRMm9j1yaH8p2n1rYgTJeu4hyxBADA";
    const decodedUri = bs58.decode(exampleUri);
    const prefix = hre.ethers.utils.hexZeroPad(`0x${decodedUri.slice(0, 2).toString("hex")}`, 32);
    const icons = await Icons.deploy(prefix);
    await icons.deployed();
    console.log("Deployed contract " + icons.address);

    // Save the address to a file
    const FILENAME = "address.txt";
    fs.writeFileSync(FILENAME, icons.address);
    console.log("Saved address to " + FILENAME);

    // Fund the contract with LINK
    const signer = hre.ethers.provider.getSigner();
    const link = new hre.ethers.Contract(LINK_ADDRESS, ERC20ABI.abi, signer);
    await link.transfer(icons.address, (1e18).toString());
    console.log("Initialized LINK contract and sent LINK tokens");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
