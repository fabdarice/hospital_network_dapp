pragma solidity ^0.4.17;

import './Hospital.sol';
import './Ownable.sol';

contract MedNetwork is Ownable {
  address[] public hospitals;
  address public medicalRecord;

  event HospitalCreation(address contractAddress);

  /**
   * @dev Med Network Contract Constructor
   * @param _recordContract [address of MedicalRecord contract]
   */
  function MedNetwork(address _recordContract) public {
    medicalRecord = _recordContract;
  }

  modifier onlyIfAuthorized(address _hospital) {
    bool authorized = false;
    for (uint256 i = 0; i < hospitals.length; i++) {
      if (hospitals[i] == _hospital) {
        authorized = true;
        break;
      }
    }

    require(authorized);
    _;
  }

  /**
   * @dev Add a hospital to the system network
   * @param  _admin [wallet address of hospital user admin]
   */
  function addHospital(address _admin) onlyOwner public {
    address newHospital = new Hospital(medicalRecord, _admin);
    hospitals.push(newHospital);
    HospitalCreation(newHospital);
  }

  /**
   * @dev Display if a patient has an admission record within a specific hospital
   * @param  _fullName [Patient Full Name]
   * @param  _hospital [address of Hospital contract]
   * @return  Returns Yes if patient has stayed in the hospital before, false otherwise
   */
  function patientHasRecordForHospital(bytes32 _fullName, address _hospital) onlyIfAuthorized(_hospital) view public returns (bool) {
    Hospital hospital = Hospital(_hospital);
    return hospital.patientHasRecord(_fullName);
  }

  /**
   * @dev Display if a patient had an admission record in one of the hospital within the network
   * @param  _fullName [Patient Full Name]
   * @return  [Returns Yes if patient has stayed in any hospital in the network before, false otherwise]
   */
  function patientHasRecordInNetwork(bytes32 _fullName) public view returns (bool) {
    for (uint256 i = 0; i < hospitals.length; i++) {
      Hospital hospital = Hospital(hospitals[i]);
      if (hospital.patientHasRecord(_fullName)) {
        return true;
      }
    }
    return false;
  }
}
