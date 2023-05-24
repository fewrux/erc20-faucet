import { useState } from 'react'
import { mint } from './services/Web3Service'

export function App() {
  const [message, setMessage] = useState('')

  function onClickConnect() {
    setMessage('Minting your tokens... please wait...')

    mint()
      .then((tx) => setMessage(`PRCs successfully minted! Tx: ${tx}`))
      .catch((error) => setMessage(error.message))
  }

  return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header className="mb-auto">
        <div>
          <h3 className="float-md-start mb-0">ProtoCoin Faucet</h3>
          <nav className="nav nav-masthead justify-content-center float-md-end">
            <a
              className="nav-link fw-bold py-1 px-0 active"
              aria-current="page"
              href="#"
            >
              Home
            </a>
            <a className="nav-link fw-bold py-1 px-0" href="#">
              About
            </a>
            <a className="nav-link fw-bold py-1 px-0" href="#">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="px-3">
        <h1>Get your ProtoCoins</h1>
        <p className="lead w-75 mx-auto">
          Once a day, earn 1.000 PRCs for free just by connecting your MetaMask
          below.
        </p>
        <p className="lead">
          <button
            onClick={onClickConnect}
            className="btn btn-lg btn-light fw-bold border-white bg-white"
          >
            <img
              src="/assets/metamask.svg"
              alt="MetaMask logo"
              width={48}
              className="me-2"
            />
            Connect MetaMask
          </button>
        </p>
        <p className="lead">{message}</p>
      </main>

      <footer className="mt-auto text-white-50">
        <p>
          Built by{' '}
          <a href="https://github.com/blockncounter" className="text-white">
            blockncounter
          </a>{' '}
          &copy; {new Date().getFullYear()}.
        </p>
      </footer>
    </div>
  )
}
