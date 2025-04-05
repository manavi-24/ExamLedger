//  import React from "react";
//  import { Calculator, Code, Beaker } from "lucide-react";


// function ExamSelection({ onSelectSubject }) {
//     const subjects = [
//       {
//         id: 'mathematics',
//         name: 'Mathematics',
//         icon: Calculator,
//         description: 'Advanced calculus and algebra problems',
//       },
//       {
//         id: 'programming',
//         name: 'Programming',
//         icon: Code,
//         description: 'Data structures and algorithms',
//       },
//       {
//         id: 'science',
//         name: 'Science',
//         icon: Beaker,
//         description: 'Physics and chemistry concepts',
//       },
//     ];
  
//     return (
//       <div className="space-y-8">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800">Select Your Exam</h2>
//           <p className="mt-2 text-gray-600">Choose a subject to begin your examination</p>
//         </div>
  
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {subjects.map((subject) => {
//             const Icon = subject.icon;
//             return (
//               <button
//                 key={subject.id}
//                 onClick={() => onSelectSubject(subject.id)}
//                 className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg"
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className="p-3 bg-indigo-100 rounded-full">
//                     <Icon className="h-8 w-8 text-indigo-600" />
//                   </div>
//                   <h3 className="mt-4 text-lg font-semibold text-gray-800">{subject.name}</h3>
//                   <p className="mt-2 text-sm text-gray-600">{subject.description}</p>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
  
//   export default ExamSelection;






import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Code, Beaker, CloudCog } from "lucide-react";
import { ethers } from "ethers";
import ExamInterface from "./ExamInterface";



 var ExamManagerABI =[
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
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldAdmin",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "examId",
        "type": "uint256"
      }
    ],
    "name": "ExamActivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "examId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "date",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "ExamCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "examId",
        "type": "uint256"
      }
    ],
    "name": "ExamDeactivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "examId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "date",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "ExamUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_examId",
        "type": "uint256"
      }
    ],
    "name": "activateExam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      }
    ],
    "name": "addAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_date",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "createExam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_examId",
        "type": "uint256"
      }
    ],
    "name": "deactivateExam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "exams",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "date",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "admin",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isActivated",
        "type": "bool"
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
    "inputs": [],
    "name": "getCurrentTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_examId",
        "type": "uint256"
      }
    ],
    "name": "getExam",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextExamId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_examId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_date",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "updateExam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


// Update this with your deployed contract address on Holesky
const contractAddress = "0xEBB7376B1D6084243519BFA9c1067F1Ff5EB3C11";

// Holesky network configuration
const NETWORK_CONFIG = {
  chainId: "0x4268", // Holesky chain ID
  chainName: "Holesky",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: ["https://spring-shy-voice.ethereum-holesky.quiknode.pro/97efd17afa07e578c0e82a454a041d7442826404"],
  blockExplorerUrls: ["https://holesky.etherscan.io"]
};

const iconMap = {
  mathematics: Calculator,
  programming: Code,
  science: Beaker,
};

const ExamSelection = ({ onSelectExam }) => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const switchToHolesky = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORK_CONFIG]
      });
    } catch (error) {
      console.error('Error switching to Holesky:', error);
      throw new Error('Failed to switch to Holesky network');
    }
  };

  const fetchExams = async () => {
    setLoading(true);
    setError('');
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this application');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== NETWORK_CONFIG.chainId) {
        await switchToHolesky();
      }

      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get the connected account
      const account = await signer.getAddress();
      console.log('Connected account:', account);

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, ExamManagerABI, signer);
      console.log('Contract instance created');

      // Get total number of exams
      const totalExams = await contract.nextExamId();
      console.log('Total exams:', totalExams.toString());

      const examList = [];

      // Fetch each exam
      for (let i = 0; i < totalExams; i++) {
        try {
          console.log(`Fetching exam ${i}...`);
          const exam = await contract.getExam(i);
          const [name, date, duration, admin, isActivated, ipfsHash] = exam;
          console.log(`Exam ${i} data:`, { name, date, duration, admin, isActivated, ipfsHash });

          if (isActivated) {
            examList.push({
              id: i,
              name,
              date: Number(date),
              duration: Number(duration),
              admin,
              ipfsHash,
              subjectId: name.toLowerCase().includes("math")
                ? "mathematics"
                : name.toLowerCase().includes("program")
                ? "programming"
                : "science",
            });
          }
        } catch (examError) {
          console.error(`Error fetching exam ${i}:`, examError);
          continue;
        }
      }

      console.log('Final exam list:', examList);
      setExams(examList);

      if (examList.length === 0) {
        setError('No active exams found. Please check back later.');
      }
    } catch (error) {
      console.error('Error in fetchExams:', error);
      setError(`Failed to fetch exams: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExamClick = async (exam) => {
    try {
      console.log("IPFS Hash:", exam.ipfsHash);
      
      if (!exam.ipfsHash) {
        throw new Error("No IPFS hash found for this exam");
      }

      const response = await fetch(`https://ipfs.io/ipfs/${exam.ipfsHash}`);
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS: ${response.status}`);
      }

      const data = await response.json();
      console.log("IPFS Response:", data);

      if (!data || (!Array.isArray(data) && !data.questions)) {
        throw new Error("Invalid question format from IPFS");
      }

      // Get questions from the response
      const questions = Array.isArray(data) ? data : data.questions;

      // Validate each question has required fields
      const validatedQuestions = questions.map((q, index) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length === 0) {
          throw new Error(`Invalid question format at index ${index}`);
        }
        return {
          id: q.id || index,
          question: q.question,
          options: q.options,
          correct: q.correct
        };
      });

      const examWithQuestions = {
        ...exam,
        questions: validatedQuestions
      };

      console.log("Processed exam with questions:", examWithQuestions);
      setSelectedExam(examWithQuestions);
    } catch (error) {
      console.error("Error fetching exam questions:", error);
      setError(`Failed to load exam questions: ${error.message}`);
    }
  };

  if (selectedExam) {
    return (
      <ExamInterface 
        exam={selectedExam}
        onBack={() => setSelectedExam(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Available Exams</h2>
        <p className="mt-2 text-gray-600">Click on a subject to begin the test</p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading exams...</p>
        </div>
      )}

      {!loading && exams.length === 0 && !error && (
        <div className="text-center p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          No exams available at the moment.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const Icon = iconMap[exam.subjectId] || Beaker;
          return (
            <button
              key={exam.id}
              onClick={() => handleExamClick(exam)}
              disabled={loading}
              className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg disabled:opacity-50"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{exam.name}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {new Date(exam.date * 1000).toLocaleString()} • {exam.duration} mins
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExamSelection;