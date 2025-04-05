import React, { useState } from "react";
import { ethers } from "ethers";
import { User, Mail, Phone, Calendar, Hash } from "lucide-react";
import ExamSelectionFromBlockchain from "./ExamSelection";
import ExamSelection from "./ExamSelection";

const CONTRACT_ADDRESS = "0x7b08Fb7a84d509180f2879EECc3d42c421588935"; // 🔴 Your contract address
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "rollNo",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "StudentRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "rollNo",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "StudentUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_rollNo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "registerStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "students",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "rollNo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_student",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_rollNo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "updateStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function StudentRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  // 🟢 Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Connect to MetaMask
  const connectWallet = async () => {
    setErrorMessage(""); // Reset error message
    if (!window.ethereum) {
      setErrorMessage("MetaMask is not installed. Please install it.");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request accounts
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      console.log("Connected to MetaMask:", address);
    } catch (error) {
      console.error("MetaMask connection failed:", error);
      setErrorMessage("Failed to connect to MetaMask. Please try again.");
    }
  };

  // 🟢 Register Student on Blockchain
  const registerStudent = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    if (!account) {
      setErrorMessage("Please connect to MetaMask first!");
      return;
    }

    if (!formData.name || !formData.rollNo || !formData.email || !formData.phone || !formData.dob) {
      setErrorMessage("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // 🔹 Simulating IPFS Hash (Replace this with actual IPFS upload logic)
      const ipfsHash = "QmExampleIPFSHash";

      // 🔹 Sending transaction to register the student
      const tx = await contract.registerStudent(formData.name, formData.rollNo, ipfsHash);
      await tx.wait(); // Wait for transaction confirmation


      alert("✅ Student Registered Successfully!");
      setIsRegistered(true);
      setFormData({ name: "", rollNo: "", email: "", phone: "", dob: "" }); // Reset form
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(error.message || "Transaction failed!");
    } finally {
      setLoading(false);
    }
  };

    if (isRegistered) {
      return <ExamSelection />;
    }
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Complete Your Registration</h2>

      {/* 🔹 MetaMask Connection */}
      {!account ? (
        <button
          onClick={connectWallet}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-indigo-600 hover:bg-gray-100"
        >
          Connect MetaMask
        </button>
      ) : (
        <p className="text-green-600 text-center mb-4">✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      )}

      {/* 🔹 Error Message */}
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

      {/* 🔹 Registration Form */}
      <form onSubmit={registerStudent} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="pl-10 w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="relative">
          <Hash className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="Roll Number"
            required
            className="pl-10 w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="pl-10 w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="pl-10 w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-gray-400" />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="pl-10 w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* 🔹 Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          {loading ? "Registering..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}

export default StudentRegistration;
