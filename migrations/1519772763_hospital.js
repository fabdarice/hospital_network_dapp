var MedicalRecord = artifacts.require('./MedicalRecord.sol');
var MedNetwork = artifacts.require('./MedNetwork.sol');

module.exports = function(deployer) {
  deployer.deploy(MedicalRecord).then(() => {
    return deployer.deploy(MedNetwork, MedicalRecord.address);
  });
};
