import React, { useState, useEffect } from 'react';
import { LogIn, Key, Wallet } from 'lucide-react';
import { ethers } from 'ethers';
import StudentRegistration from './StudentRegistration';

function Login({ onLogin }) {
  const [loginMethod, setLoginMethod] = useState('password');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const validateWalletAddress = (address) => {
    try {
      return ethers.utils.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  // Check if MetaMask is installed
  const checkMetaMaskInstalled = () => {
    return window.ethereum !== undefined;
  };

  const handleRegistrationSubmit = (studentData) => {
    // Here you would typically send the student data to your backend
    console.log('Student registration data:', studentData);
    onLogin();
  };

  const connectWallet = async (address = null) => {
    try {
      setIsConnecting(true);
      setError('');

      // Check if MetaMask is installed
      if (!checkMetaMaskInstalled()) {
        throw new Error('Please install MetaMask to use wallet login');
      }

      const requestId = Date.now().toString();
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts',
        params: [],
        id: requestId
      });
      
      const connectedAddress = address || accounts[0];
      
      if (!validateWalletAddress(connectedAddress)) {
        throw new Error('Invalid wallet address');
      }

      if (address && address.toLowerCase() !== connectedAddress.toLowerCase()) {
        throw new Error('Connected wallet address does not match the provided address');
      }

      setWalletAddress(connectedAddress);
      setIsManualInput(false);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(connectedAddress);
      console.log('Wallet balance:', ethers.utils.formatEther(balance));

      // Show registration form instead of calling onLogin directly
      setShowRegistration(true);
    } catch (error) {
      setError(error.message);
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualAddressChange = (e) => {
    const address = e.target.value;
    setWalletAddress(address);
    setIsManualInput(true);
    
    // Validate address format
    const isValid = validateWalletAddress(address);
    setIsAddressValid(isValid);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Handle address validation and MetaMask connection
  useEffect(() => {
    if (isAddressValid && walletAddress && isManualInput) {
      // If address is valid and manually entered, show a message
      setError('Valid address detected. Click "Connect MetaMask" to proceed.');
    } else if (walletAddress && !isAddressValid && isManualInput) {
      setError('Invalid wallet address format');
    }
  }, [isAddressValid, walletAddress, isManualInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (loginMethod === 'wallet') {
      if (!walletAddress) {
        setError('Please enter or connect a wallet address');
        return;
      }
      if (!validateWalletAddress(walletAddress)) {
        setError('Invalid wallet address');
        return;
      }
      
      // Always use MetaMask connection for wallet login
      await connectWallet(walletAddress);
    } else {
      // Handle password login
      if (!password) {
        setError('Please enter your password');
        return;
      }
      onLogin();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
      {showRegistration ? (
        <StudentRegistration onSubmit={handleRegistrationSubmit} />
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Welcome to DecentralExam</h2>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                loginMethod === 'password'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setLoginMethod('password')}
            >
              <Key className="h-5 w-5 mr-2" />
              Password
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                loginMethod === 'wallet'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setLoginMethod('wallet')}
            >
              <Wallet className="h-5 w-5 mr-2" />
              Wallet
            </button>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              error.includes('Valid address detected') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginMethod === 'password' ? (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            ) : (
              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
                  Wallet Address
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="walletAddress"
                    value={walletAddress}
                    onChange={handleManualAddressChange}
                    className={`flex-1 rounded-l-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isAddressValid && walletAddress 
                        ? 'border-green-500 focus:border-green-500' 
                        : 'border-gray-300 focus:border-indigo-500'
                    }`}
                    placeholder="Enter wallet address or connect MetaMask"
                  />
                  <button
                    type="button"
                    onClick={() => connectWallet(walletAddress)}
                    disabled={isConnecting || !isAddressValid}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter a wallet address and click "Connect MetaMask" to proceed
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isConnecting}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <LogIn className="h-5 w-5 mr-2" />
              {loginMethod === 'password' ? 'Login' : 'Continue'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;