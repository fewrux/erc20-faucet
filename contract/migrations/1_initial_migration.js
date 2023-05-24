const ProtoCoin = artifacts.require("ProtoCoin");

module.exports = function (deployer) {
  deployer.deploy(ProtoCoin);
};
