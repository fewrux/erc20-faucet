import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import HDWalletProvider from '@truffle/hdwallet-provider'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ABI = require('../abi.json')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localKeyProvider: any = new HDWalletProvider({
  privateKeys: [`${process.env.PRIVATE_KEY}`],
  providerOrUrl: `${process.env.NODE_URL}`,
})

const web3 = new Web3(localKeyProvider)

const contract = new web3.eth.Contract(
  ABI as AbiItem[],
  `${process.env.CONTRACT_ADDRESS}`,
  { from: `${process.env.WALLET_ADDRESS}` },
)

export async function mintAndTransfer(to: string): Promise<string> {
  const tx = await contract.methods.mint(to).send()
  return tx.transactionHash
}

export async function getBalance(): Promise<string> {
  const balance = await contract.methods
    .balanceOf(`${process.env.WALLET_ADDRESS}`)
    .call()

  return balance
}
