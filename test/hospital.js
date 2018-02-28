import expectThrow from './helpers/expectThrow'

const Hospital = artifacts.require("./Hospital.sol");
const MedicalRecord = artifacts.require("./MedicalRecord.sol");
const MedNetwork = artifacts.require("./MedNetwork.sol");

contract('Hospital', (accounts) => {
  const authorizedPatient = "Fabrice Cheng"
  const nonAuthorizedPatient = "James Harden"
  const nonPatient = "John Doe"
  const admin = accounts[0]
  var instance

  before('create subject instance before each test', async () => {
    await MedicalRecord.deployed();
    const medNetworkInstance = await MedNetwork.deployed();

    const hospitalContractAddress = await medNetworkInstance.addHospital(admin)
    instance = Hospital.at(hospitalContractAddress.logs[0].args.contractAddress);
  });

  it('should successfully add a patient to hospital list', async () => {
    await instance.addPatient(authorizedPatient, true, {from: admin})
    await instance.addPatient(nonAuthorizedPatient, false, {from: admin})
  })

  it('should successfully add a new record when patient is admitted to hospital', async () => {
    await instance.enterHospital(authorizedPatient, 0, {from: admin})
    await instance.enterHospital(nonAuthorizedPatient, 1, {from: admin})
  })

  it('should successfully update a patient visit when he leaves', async () => {
    await instance.leaveHospital(authorizedPatient, {from: admin})
  })

  it('should successfully return if a patient has a stay record if authorized', async () => {
    const transaction = await instance.patientHasRecord(authorizedPatient, {from: admin})
    await expectThrow(instance.patientHasRecord(nonPatient, {from: admin}))
    assert.equal(transaction, true, 'Patient record should exist')
  })

  it('should not return if a patient has a stay record if not authorized', async () => {
    await expectThrow(instance.patientHasRecord(nonAuthorizedPatient, {from: admin}))
  })
});
