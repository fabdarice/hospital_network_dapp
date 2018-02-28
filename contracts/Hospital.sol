pragma solidity ^0.4.17;

import './MedicalRecord.sol';

contract Hospital {
  MedicalRecord public medicalRecord;
  address public admin;
  address public medNetwork;

  struct Patient {
    bytes32 fullName;
    bool access;
  }

  mapping(bytes32 => Patient) patients;

  modifier onlyAdmin() {
    require(msg.sender == admin);
    _;
  }

  modifier onlyIfGrantedAccess(bytes32 _fullName) {
    require(patients[_fullName].access || msg.sender == medNetwork);
    _;
  }

  /**
   * @dev Hospital constructor
   * @param  _contract [address of MedicalRecord contract]
   * @param  _admin [address of Hospital admin]
   */
  function Hospital(address _contract, address _admin) public {
    medicalRecord = MedicalRecord(_contract);
    medNetwork = msg.sender;
    admin = _admin;
  }

  /**
   * @dev Add a Patient Profile into Hospital system
   * @param  _fullName [Patient Full Name]
   * @param   _access   [Authorization given by Patient to access his infos]
   */
  function addPatient(bytes32 _fullName, bool _access) onlyAdmin public {
    patients[_fullName].fullName = _fullName;
    patients[_fullName].access = _access;
  }

  /**
   * @dev Add a patient admission record inside the hospital
   * @param  _fullName [Patient Full Name]
   * @param  _symptoms     [Symptom of the visit]
   */
  function enterHospital(bytes32 _fullName, MedicalRecord.Symptoms _symptoms) onlyAdmin public {
    medicalRecord.addAdmissionRecord(_fullName, _symptoms);
  }

  /**
   * @dev Add a patient discharge record for the hospital
   * @param  _fullName [Patient Full Name]
   */
  function leaveHospital(bytes32 _fullName) public {
    medicalRecord.addDischargeRecord(_fullName);
  }

  /**
   * @dev Display if a patient has an admission record within the hospital
   * @param  _fullName [Patient Full Name]
   * @return  Returns Yes if patient has stayed in the hospital before, false otherwise
   */
  function patientHasRecord(bytes32 _fullName)
  onlyIfGrantedAccess(_fullName)
  view public returns (bool) {
    return medicalRecord.recordExist(_fullName);
  }
}
