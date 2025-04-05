// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

contract ExamManager {
    address public admin;
    mapping(address => bool) public isAdmin;

    event ExamCreated(uint256 indexed examId, string name, uint256 date, uint256 duration, address admin, string ipfsHash);
    event ExamUpdated(uint256 indexed examId, string name, uint256 date, uint256 duration, string ipfsHash);
    event ExamActivated(uint256 indexed examId);
    event ExamDeactivated(uint256 indexed examId);
    event AdminAdded(address indexed newAdmin);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin || isAdmin[msg.sender], "Only admin can perform this action");
        _;
    }

    struct Exam {
        uint256 id;
        string name;
        uint256 date;
        uint256 duration;
        address admin;
        bool isActivated;
        string ipfsHash;
    }

    uint256 public nextExamId = 0;
    mapping(uint256 => Exam) public exams;

    constructor() {
        admin = msg.sender;
        isAdmin[msg.sender] = true; // Admin is set in the constructor itself
    }

    function addAdmin(address _admin) public onlyAdmin {
        require(!isAdmin[_admin], "Already an admin");
        isAdmin[_admin] = true;
        emit AdminAdded(_admin);
    }

    function createExam(
        string calldata _name,
        uint256 _date, 
        uint256 _duration, 
        string calldata _ipfsHash
    ) public onlyAdmin {
        require(_date > block.timestamp, "Exam date must be in the future");
        require(_duration > 0, "Exam duration must be greater than 0");

        // Store exam data
        exams[nextExamId] = Exam(nextExamId, _name, _date, _duration, msg.sender, false, _ipfsHash);
        emit ExamCreated(nextExamId, _name, _date, _duration, msg.sender, _ipfsHash);

        nextExamId++; // Increment after storing the exam
    }

    function deactivateExam(uint256 _examId) public onlyAdmin {
        require(_examId < nextExamId, "Exam does not exist");
        exams[_examId].isActivated = false;
        emit ExamDeactivated(_examId);
    }

    function activateExam(uint256 _examId) public onlyAdmin {
        require(_examId < nextExamId, "Exam does not exist");
        require(block.timestamp >= exams[_examId].date, "Exam date has not yet arrived");
        require(!exams[_examId].isActivated, "Exam is already activated");

        exams[_examId].isActivated = true;
        emit ExamActivated(_examId);
    }

    function updateExam(
        uint256 _examId,
        string memory _name,
        uint256 _date, 
        uint256 _duration, 
        string memory _ipfsHash
    ) public onlyAdmin {
        require(_examId < nextExamId, "Exam does not exist");
        require(_date > block.timestamp, "Exam date must be in the future");
        require(_duration > 0, "Exam duration must be greater than 0");

        exams[_examId].name = _name;
        exams[_examId].date = _date;
        exams[_examId].duration = _duration;
        exams[_examId].ipfsHash = _ipfsHash;

        emit ExamUpdated(_examId, _name, _date, _duration, _ipfsHash);
    }

    function getExam(uint256 _examId) public view returns (
        string memory,
        uint256,
        uint256,
        address,
        bool,
        string memory
    ) {
        require(_examId < nextExamId, "Exam does not exist");

        Exam storage exam = exams[_examId];

        return (
            exam.name, 
            exam.date, 
            exam.duration, 
            exam.admin, 
            exam.isActivated,
            exam.ipfsHash
        );
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function transferAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid new admin address");
        address oldAdmin = admin;
        admin = newAdmin;
        emit AdminTransferred(oldAdmin, newAdmin);
    }
}
