import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SimpleStorage from './SimpleStorage.json';

const App = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [storageValue, setStorageValue] = useState(0);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const loadWeb3 = async () => {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                await window.ethereum.enable();
            } else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider);
            } else {
                window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        };

        const loadBlockchainData = async () => {
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const networkData = SimpleStorage.networks[networkId];
            if (networkData) {
                const simpleStorage = new web3.eth.Contract(SimpleStorage.abi, networkData.address);
                setContract(simpleStorage);
                const value = await simpleStorage.methods.get().call();
                setStorageValue(value);
            } else {
                window.alert('SimpleStorage contract not deployed to detected network.');
            }
        };

        loadWeb3();
        loadBlockchainData();
    }, []);

    const storeData = async () => {
        await contract.methods.set(inputValue).send({ from: account });
        const value = await contract.methods.get().call();
        setStorageValue(value);
    };

    return (
        <div>
            <h1>Simple Storage DApp</h1>
            <p>Account: {account}</p>
            <p>Stored Value: {storageValue}</p>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button onClick={storeData}>Store Value</button>
        </div>
    );
};

export default App;
