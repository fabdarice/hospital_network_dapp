pragma solidity ^0.4.17;

contract MedicalRecord {
  enum Symptoms {ChestPain, HeadAche, Vomiting, Sprain, Fractures}

  struct Visit {
    Symptoms symptoms;
    uint256 admissionDate;
    uint256 dischargeDate;
  }

  mapping(address => mapping(bytes32 => Visit[])) visits;

  /**
   * @dev Add an admission record
   * @param  _fullName [Patient Full Name]
   * @param  _symptoms     [Symptom of the visit]
   */
  function addAdmissionRecord(bytes32 _fullName, Symptoms _symptoms) external {
    Visit memory visit = Visit(_symptoms, now, 0);
    visits[msg.sender][_fullName].push(visit);
  }

  /**
   * @dev Add a patient discharge record
   * @param  _fullName [Patient Full Name]
   */
  function addDischargeRecord(bytes32 _fullName) external {
   uint256 lastVisitIndex = visits[msg.sender][_fullName].length - 1;
   visits[msg.sender][_fullName][lastVisitIndex].dischargeDate = now;
  }

  /**
   * @dev Display if a patient has an admission record
   * @param  _fullName [Patient Full Name]
   * @return  Returns Yes if patient has an admission record
   */
  function recordExist(bytes32 _fullName) view external returns (bool) {
    return visits[msg.sender][_fullName].length != 0;
  }
}
