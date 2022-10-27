module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      //gas: 5000000
      //from: '0x678930A16a8EE99D17423CC064188459BC25D110'
    }
  },
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/abis',
  compilers: {
    solc: {
      version: '^0.8.0',
      optimizer: {
        enabled: 'true',
        runs: 200
      }
      /*settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }*/
    }
  }
};
