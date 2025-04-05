// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

interface IExamManager {
    function getExam(uint256 _examId) external view returns (
        string memory, 
        uint256, 
        uint256, 
        address, 
        bool, 
        string memory
    );
    function nextExamId() external view returns (uint256);
}

interface IStudentRegistry {
    function getStudent(address _student) external view returns (string memory, string memory);
}

contract ExamSubmissionManager {
    address public admin;
    mapping(address => bool) public isAdmin;
    IExamManager public examManager;
    IStudentRegistry public studentRegistry;

    event ExamSubmitted(uint256 indexed examId, address indexed student, string ipfsHash);
    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed removedAdmin);

    struct Submission {
        uint256 examId;
        address student;
        string ipfsHash;
        bool submitted;
    }

    mapping(uint256 => mapping(address => Submission)) public submissions;
    mapping(uint256 => address[]) private studentsSubmitted; // Track students who submitted

    modifier onlyAdmin() {
        require(msg.sender == admin || isAdmin[msg.sender], "Only admin can manage submissions");
        _;
    }

    constructor(address _examManagerAddress, address _studentRegistryAddress) {
        admin = msg.sender;
        examManager = IExamManager(_examManagerAddress);
        studentRegistry = IStudentRegistry(_studentRegistryAddress);
    }

    function addAdmin(address _admin) public onlyAdmin {
        require(!isAdmin[_admin], "Already an admin");
        isAdmin[_admin] = true;
        emit AdminAdded(_admin);
    }

    function removeAdmin(address _admin) public onlyAdmin {
        require(isAdmin[_admin], "Not an admin");
        isAdmin[_admin] = false;
        emit AdminRemoved(_admin);
    }

    function submitExam(uint256 _examId, string calldata _ipfsHash) public {
        require(_examId < examManager.nextExamId(), "Exam does not exist");

        (, , , , bool isActivated, ) = examManager.getExam(_examId);
        require(isActivated, "Exam is not active");

        require(!submissions[_examId][msg.sender].submitted, "Already submitted");

        // Check if student is registered
        (string memory name, ) = studentRegistry.getStudent(msg.sender);
        require(bytes(name).length > 0, "Student is not registered");

        // Store submission
        submissions[_examId][msg.sender] = Submission({
            examId: _examId,
            student: msg.sender,
            ipfsHash: _ipfsHash,
            submitted: true
        });

        studentsSubmitted[_examId].push(msg.sender); // Track student address

        emit ExamSubmitted(_examId, msg.sender, _ipfsHash);
    }

    function getSubmission(uint256 _examId, address _student) public view returns (string memory, bool) {
        require(submissions[_examId][_student].submitted, "No submission found");
        return (submissions[_examId][_student].ipfsHash, true);
    }

    function getAllSubmissionsForExam(uint256 _examId) public view onlyAdmin returns (Submission[] memory) {
        uint256 count = studentsSubmitted[_examId].length;
        Submission[] memory examSubmissions = new Submission[](count);

        for (uint256 i = 0; i < count; i++) {
            address student = studentsSubmitted[_examId][i];
            examSubmissions[i] = submissions[_examId][student];
        }

        return examSubmissions;
    }
}
