import React, { useState, useEffect } from 'react';
import { Clock, Send, ArrowLeft } from 'lucide-react';
import { ethers } from 'ethers';
import ResultInterface from './ResultInterface';

// Update with your deployed contract address
const EXAM_SUBMISSION_ADDRESS = "0x5A8D1297c6125CD5F7fF10038035AE440ce9718d";

const ExamSubmissionABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_examManagerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_studentRegistryAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
    "inputs": [],
    "name": "examManager",
    "outputs": [
      {
        "internalType": "contract IExamManager",
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
        "internalType": "uint256",
        "name": "_examId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_student",
        "type": "address"
      }
    ],
    "name": "getSubmission",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_examId",
        "type": "uint256"
      }
    ],
    "name": "getAllSubmissionsForExam",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "examId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "student",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "submitted",
            "type": "bool"
          }
        ],
        "internalType": "struct ExamSubmissionManager.Submission[]",
        "name": "",
        "type": "tuple[]"
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      }
    ],
    "name": "removeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "studentRegistry",
    "outputs": [
      {
        "internalType": "contract IStudentRegistry",
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
        "internalType": "uint256",
        "name": "_examId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "submitExam",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function ExamInterface({ exam, onBack }) {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const uploadToIPFS = async (data) => {
    try {
      // Pinata API configuration
      const PINATA_API_KEY = "730a38040a0973789ac7";
      const PINATA_SECRET_KEY = "b35e6853a8a740a381d458f6d4d00c812385590b30319ec3f0487f96660a2453";
      
      // Create form data
      const formData = new FormData();
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      formData.append('file', blob, 'exam-submission.json');
      
      // Upload to Pinata
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': "730a38040a0973789ac7" ,
          'pinata_secret_api_key': "b35e6853a8a740a381d458f6d4d00c812385590b30319ec3f0487f96660a2453",
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload to IPFS: ${errorData.error || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('IPFS Upload Result:', result);
      return result.IpfsHash; // Pinata returns IpfsHash instead of ipfsHash
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setSubmissionStatus('Preparing submission...');

    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      setSubmissionStatus('Connecting to MetaMask...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(EXAM_SUBMISSION_ADDRESS, ExamSubmissionABI, signer);

      // Prepare submission data
      const submissionData = {
        examId: exam.id,
        answers: answers,
        timestamp: Date.now(),
        studentAddress: await signer.getAddress()
      };

      setSubmissionStatus('Uploading answers to IPFS...');
      const ipfsHash = await uploadToIPFS(submissionData);

      setSubmissionStatus('Submitting to blockchain...');
      const tx = await contract.submitExam(exam.id, ipfsHash);
      
      setSubmissionStatus('Waiting for transaction confirmation...');
      await tx.wait();

      setSubmissionStatus('Submission successful!');
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting exam:', error);
      setError(`Failed to submit exam: ${error.message}`);
      setSubmissionStatus('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    return <ResultInterface exam={exam} onBack={() => setShowResults(false)} />;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-bold text-gray-800">{exam.name}</h2>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span>Time remaining: {formatTime(timeLeft)}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {submissionStatus && (
          <div className="mb-4 p-3 rounded-lg bg-blue-100 text-blue-700 text-sm">
            {submissionStatus}
          </div>
        )}

        <div className="space-y-6">
          {exam.questions.map((q, index) => (
            <div key={q.id} className="border-b pb-6 last:border-b-0">
              <p className="font-medium text-gray-800 mb-4">
                {index + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(q.id, option)}
                    disabled={isSubmitting}
                    className={`p-4 rounded-lg text-left transition-colors ${
                      answers[q.id] === option
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    } disabled:opacity-50`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(answers).length !== exam.questions.length}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Send className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamInterface;