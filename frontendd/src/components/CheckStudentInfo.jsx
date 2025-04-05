import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Search, User, Hash, FileText } from 'lucide-react';

const CONTRACT_ADDRESS = "0xCEBe9CBb523c5D24d19358964933B3Eb1E9254F6"; // Your contract address
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_student",
        "type": "address"
      }
    ],
    "name": "getStudent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function CheckStudentInfo() {
  const [address, setAddress] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStudentInfo(null);

    try {
      // Validate address
      if (!ethers.utils.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      // Connect to the contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      // Call getStudent function
      const [name, rollNo, ipfsHash] = await contract.getStudent(address);

      setStudentInfo({
        name,
        rollNo,
        ipfsHash
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching student info:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Check Student Information</h2>

      <form onSubmit={handleSearch} className="space-y-6">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Student Wallet Address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="0x..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {studentInfo && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-lg text-gray-900">{studentInfo.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Hash className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Roll Number</p>
              <p className="text-lg text-gray-900">{studentInfo.rollNo}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">IPFS Hash</p>
              <p className="text-lg text-gray-900 break-all">{studentInfo.ipfsHash}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckStudentInfo; 