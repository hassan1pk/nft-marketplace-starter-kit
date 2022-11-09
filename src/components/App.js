import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from "../abis/KryptoBird.json";
//import Contract from "web3-eth-contract";

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //await this.connect();
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();

    //modern browsers
    if (provider) {
      console.log("ethereum wallet is connected");
      window.web3 = new Web3(provider);
    } else {
      console.log("no ethereum wallet is connected");
    }
  }

  /*connect() {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(this.handleAccountsChanged)
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      });
  }
  
   handleAccountsChanged(accounts) {
    console.log(accounts);
  }
*/

  async loadBlockchainData() {
    //const accounts = await window.web3.eth.getAccounts();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    this.setState({ account: accounts });
    //console.log(this.state.account);
    /*const networkId = await window.web3.eth.net.getId();
    console.log(networkId);*/
    const networkId = await window.ethereum.request({ method: "net_version" });
    console.log(networkId);
    const networkData = KryptoBird.networks[networkId];
    if (networkData) {
      const abi = KryptoBird.abi;
      const address = networkData.address;
      //const contract = new Contract(abi, address);
      const contract = new window.web3.eth.Contract(abi, address);
      console.log(contract);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
    };
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div
            className="navbar-brand col-sm-3 col-md-3 mr-0"
            style={{ color: "white" }}
          >
            Krypto Birdz (NFT) non-fungible token
          </div>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"> {this.state.account}</small>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default App;
