import { useState } from 'react'
import { mint } from './services/web3Service'
import ReCAPTCHA from 'react-google-recaptcha'

export function App() {
  const [message, setMessage] = useState('')
  const [captcha, setCaptcha] = useState('')

  function onClickConnect() {
    if (captcha) {
      setMessage('Minting your tokens... please wait...')

      mint()
        .then((tx) => setMessage(`PRC successfully minted! Tx: ${tx}`))
        .catch((error) => {
          console.error(error)
          if (
            error.response &&
            error.response.data &&
            error.response.data.includes('Minting is not available yet')
          )
            setMessage('Minting is not available yet!')
          else if (error.response && error.response.data)
            setMessage(error.response.data)
          else setMessage('Something went wrong! Please try again later.')
        })
      setCaptcha('')
    } else setMessage('Please complete the captcha!')
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
          Earn a free <strong>PRC</strong> token everyday just by connecting
          your MetaMask below.
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
            Get my token!
          </button>
        </p>
        <div className="d-inline-flex">
          <ReCAPTCHA
            sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`}
            onChange={(value) => setCaptcha(value || '')}
          />
        </div>
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
