// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 3500000, // new! Default gas limit is 3141592
      gasPrice: 100000000000, // new! Default gas price is 100 Shannon
    },
  }
};
