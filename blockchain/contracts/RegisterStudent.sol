// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

contract StudentRegistry {
    address public admin;

    struct Student {
        string name;
        string rollNo;
        string ipfsHash; 
    }

    mapping(address => Student) public students;

    event StudentRegistered(address indexed student, string name, string rollNo, string ipfsHash);
    event StudentUpdated(address indexed student, string name, string rollNo, string ipfsHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyRegisteredStudent(address _student) {
        require(bytes(students[_student].name).length > 0, "Student not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register a student (only if not already registered)
    function registerStudent(
        string memory _name,
        string memory _rollNo,
        string memory _ipfsHash
    ) public {
        require(bytes(students[msg.sender].name).length == 0, "Already registered");

        students[msg.sender] = Student(_name, _rollNo, _ipfsHash);
        emit StudentRegistered(msg.sender, _name, _rollNo, _ipfsHash);
    }

    // Get student info
    function getStudent(address _student) public view returns (string memory, string memory, string memory) {
        require(bytes(students[_student].name).length > 0, "Student not registered");
        return (students[_student].name, students[_student].rollNo, students[_student].ipfsHash);
    }

    // Admin-only function to update student information
    function updateStudent(
        address _student,
        string memory _name,
        string memory _rollNo,
        string memory _ipfsHash
    ) public onlyAdmin onlyRegisteredStudent(_student) {
        students[_student] = Student(_name, _rollNo, _ipfsHash);
        emit StudentUpdated(_student, _name, _rollNo, _ipfsHash);
    }
}
