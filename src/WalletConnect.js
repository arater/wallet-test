import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function WalletConnect() {
  const [web3Modal, setWeb3Modal] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    // initiate web3modal
    const web3modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: process.env.REACT_APP_INFURA_ID, // required
          },
        },
        coinbasewallet: {
          package: CoinbaseWalletSDK, // Required
          options: {
            appName: 'Talently', // Required
            infuraId: process.env.REACT_APP_INFURA_ID, // Required
            chainId: 1, // Mainnet chain id
            darkMode: false, // Optional. Use dark theme, defaults to false
          },
        },
      },
    });

    setWeb3Modal(web3modal);
  }, []);

  async function connectWallet() {
    const provider = await web3Modal.connect();
    addListeners(provider);
    //get signer and its address
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = await ethersProvider.getSigner();
    const userAddress = await signer.getAddress();
    //sign message
    const rawMessage = 'Sign this message to enter Talently.';
    const signature = await signer.signMessage(rawMessage);
    //verify message
    const verified = ethers.utils.verifyMessage(rawMessage, signature);
    if (verified) {
      setAddress(userAddress)
      alert("Account verified")
    }
  }

  async function addListeners(web3ModalProvider) {
    web3ModalProvider.on('accountsChanged', (accounts) => {
      window.location.reload();
    });

    // Subscribe to chainId change
    web3ModalProvider.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }

  return (
    <div>
      <div
        onClick={() => {
          connectWallet();
        }}
      >
        {address === null ? <p>Connect to wallet</p> : <p>Connected</p>}
      </div>
    </div>
  );
}

export default WalletConnect;
