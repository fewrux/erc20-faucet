import Web3 from 'web3'
import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}`

export async function mint() {
  const nextMint = localStorage.getItem('nextMint')
  if (nextMint && parseInt(nextMint) > Date.now())
    throw new Error('Minting is not available yet! Try again tomorrow.')

  if (!window.ethereum) throw new Error('No MetaMask found!')

  const web3 = new Web3(window.ethereum)
  const accounts = await web3.eth.requestAccounts()
  if (!accounts || !accounts.length) throw new Error('No accounts allowed!')

  localStorage.setItem('wallet', accounts[0])
  localStorage.setItem('nextMint', `${Date.now() + 1000 * 60 * 60 * 24}`)

  const response = await axios.post(`${API_URL}/mint/${accounts[0]}`)

  return response.data
}
