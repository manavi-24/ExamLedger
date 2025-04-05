// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IExamManager {
    function getExam(uint _examId) external view returns (string memory, uint);
}

interface IExamSubmission {
    function getSubmission(address _student, uint _examId) external view returns (string memory);
}

contract ExamResults {
    struct Result {
        uint examId;
        uint score;
        uint totalMarks;
        uint timestamp;
        string ipfsHash; // IPFS hash for detailed grading
    }

    mapping(address => uint[]) private studentExamIds; // Stores exam IDs per student
    mapping(address => mapping(uint => Result)) public studentResults;
    
    address public admin;
    IExamManager public examManager;
    IExamSubmission public examSubmission;

    event ResultPublished(address indexed student, uint indexed examId, uint score, uint totalMarks);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(address _examManager, address _examSubmission) {
        admin = msg.sender;
        examManager = IExamManager(_examManager);
        examSubmission = IExamSubmission(_examSubmission);
    }

    function submitResult(address _student, uint _examId, uint _score, string memory _ipfsHash) external onlyAdmin {
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS Hash");

        (, uint totalMarks) = examManager.getExam(_examId);
        require(totalMarks > 0, "Exam does not exist");

        string memory submissionIPFS = examSubmission.getSubmission(_student, _examId);
        require(bytes(submissionIPFS).length > 0, "No submission found");

        studentResults[_student][_examId] = Result({
            examId: _examId,
            score: _score,
            totalMarks: totalMarks,
            timestamp: block.timestamp,
            ipfsHash: _ipfsHash
        });

        studentExamIds[_student].push(_examId);

        emit ResultPublished(_student, _examId, _score, totalMarks);
    }

    function getAllResults(address _student) external view returns (Result[] memory) {
        uint examCount = studentExamIds[_student].length;
        require(examCount > 0, "No results found!");

        Result[] memory results = new Result[](examCount);
        for (uint i = 0; i < examCount; i++) {
            uint examId = studentExamIds[_student][i];
            results[i] = studentResults[_student][examId];
        }
        return results;
    }
}
