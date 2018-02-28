import expectThrow from './helpers/expectThrow'

const MedicalRecord = artifacts.require("./MedicalRecord.sol");
const MedNetwork = artifacts.require("./MedNetwork.sol");
const Hospital = artifacts.require("./Hospital.sol");

contract('MedNetwork', (accounts) => {
  const authorizedPatient = "Fabrice Cheng"
  const authorizedPatient2 = "Kevin Durant"
  const nonAuthorizedPatient = "James Harden"
  const nonPatient = "John Doe"
  const admin1 = accounts[0]
  const admin2 = accounts[1]
  var hospital1, hospital2, instance

  before('create subject instance before each test', async () => {
    await MedicalRecord.deployed();
    instance = await MedNetwork.deployed();

    const hospitalContractAddress = await instance.addHospital(admin1)
    const hospitalContractAddress2 = await instance.addHospital(admin2)

    hospital1 = Hospital.at(hospitalContractAddress.logs[0].args.contractAddress)
    hospital2 = Hospital.at(hospitalContractAddress2.logs[0].args.contractAddress)

    hospital1.addPatient(authorizedPatient, true, {from: admin1})
    hospital1.addPatient(nonAuthorizedPatient, false, {from: admin1})
    hospital2.addPatient(authorizedPatient2, true, {from: admin2})

    hospital1.enterHospital(authorizedPatient, 1, {from: admin1})
    hospital1.enterHospital(nonAuthorizedPatient, 0, {from: admin1})
    hospital2.enterHospital(authorizedPatient2, 1, {from: admin2})
  });

  it("should successfully fetch a patient stay record if authorized for a specific hospital", async () => {
    const hasRecord = await instance.patientHasRecordForHospital(authorizedPatient, hospital1.address, {from: admin1})
    const hasRecord2 = await instance.patientHasRecordForHospital(authorizedPatient2, hospital2.address, {from: admin2})

    const hasNoRecord = await instance.patientHasRecordForHospital(authorizedPatient, hospital2.address, {from: admin2})
    const hasNoRecord2 = await instance.patientHasRecordForHospital(authorizedPatient2, hospital1.address, {from: admin2})

    assert.equal(hasRecord, true, "Patient should exists in stay record for specific hospital")
    assert.equal(hasRecord2, true, "Patient should exists in stay record for specific hospital")

    assert.equal(hasNoRecord, false, "Patient should not exists in stay record for specific hospital")
    assert.equal(hasNoRecord2, false, "Patient should not exists in stay record for specific hospital")
  })

  it('should successfully fetch a patient stay record in the network', async () => {
    const hasRecordInNetwork = await instance.patientHasRecordInNetwork(authorizedPatient)
    const hasRecordInNetwork2 = await instance.patientHasRecordInNetwork(authorizedPatient2)

    const hasNoRecordInNetwork = await instance.patientHasRecordInNetwork(nonPatient)

    assert.equal(hasRecordInNetwork, true, "Patient has a record in the network")
    assert.equal(hasRecordInNetwork2, true, "Patient has a record in the network")
    assert.equal(hasNoRecordInNetwork, false, "Patient has no record in the network")
  })

});
