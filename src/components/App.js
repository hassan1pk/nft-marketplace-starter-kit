import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBird from "../abis/KryptoBird.json";
//import Contract from "web3-eth-contract";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import "./App.css";

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    //await this.connect();
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider(); //this uses metamask detect ethereum provider to get a provider
    //const provider = Web3.givenProvider; //this uses the web3 library to get the provider

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
    this.setState({ account: accounts[0] });
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
      this.setState({ contract });
      console.log(this.state.contract);

      //call the total supply of our contract
      var totalSupply = await contract.methods.totalSupply().call();
      this.setState({ totalSupply });
      console.log("total supply", this.state.totalSupply);
      for (let i = 0; i < this.state.totalSupply; i++) {
        const KryptoBird = await contract.methods.kryptoBirdz(i).call();
        //result.push(KryptoBird);

        this.setState({ kryptoBirdz: [...this.state.kryptoBirdz, KryptoBird] });
      }
      console.log(this.state.kryptoBirdz);
    } else {
      window.alert("Smart contract not deployed");
    }
  }

  mint = (kryptoBird) => {
    this.state.contract.methods
      .mint(kryptoBird)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ kryptoBirdz: [...this.state.kryptoBirdz, KryptoBird] });
      });

    console.log(kryptoBird);
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      kryptoBirdz: [],
      //nftPath: "",
    };
  }

  render() {
    return (
      <div className="container-filled">
        {console.log("array of tokens", this.state.kryptoBirdz)}
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

        <div className="container-fluid mt-1">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ opacity: "0.8" }}
              >
                <h1 style={{ color: "black" }}>
                  KryptoBirdz - NFT Marketplace
                </h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    //const kryptoBird = this.state.nftPath;
                    const kryptoBird = this.kryptoBird.value;
                    this.mint(kryptoBird);
                    //this.setState({ nftPath: "" });
                    this.kryptoBird.value = "";
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add file location"
                    className="form-control mb-1"
                    /*value={this.state.nftPath}
                    onChange={(event) => {
                      this.setState({ nftPath: event.target.value });
                    }}*/
                    ref={(input) => (this.kryptoBird = input)}
                  ></input>
                  <input
                    step={{ margin: "6px" }}
                    type="submit"
                    className="btn btn-primary btn-black"
                    value="MINT"
                  ></input>
                </form>
              </div>
            </main>
          </div>
          <hr></hr>
          <div className="row textCenter">
            {this.state.kryptoBirdz.map((kryptoBird, key) => {
              return (
                <div key={key}>
                  <MDBCard className="token img" style={{ maxWidth: "22rem" }}>
                    <MDBCardImage
                      src={kryptoBird}
                      height="250rem"
                      position="top"
                      style={{ marginRight: "4px" }}
                    ></MDBCardImage>
                    <MDBCardBody>
                      <MDBCardTitle>KryptoBirdz</MDBCardTitle>
                      <MDBCardText>
                        The KryptoBirdz are 20 uniquely generated KBirdz from
                        the cyberpunk cloud galaxy Mystopia. There is only one
                        of each birad and each bird can be owned by a single
                        person on the Ethereum blockhain
                      </MDBCardText>
                      <MDBBtn href={kryptoBird}>Download</MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

/*
https://i.ibb.co/gyNcf7b/k01.png
https://i.ibb.co/CBFs7pV/k02.png
https://i.ibb.co/S6V4yc3/k03.png
https://i.ibb.co/kyBZBpj/k04.png
https://i.ibb.co/JKSX1vf/k05.png
https://i.ibb.co/QJbDCsR/k06.png
https://i.ibb.co/qgxdsL5/k07.png
https://i.ibb.co/z5LRCkB/k08.png
https://i.ibb.co/Zz7LhYd/k09.png
https://i.ibb.co/8DcSdgm/k10.png
https://i.ibb.co/6b07WMQ/k11.png
*/
