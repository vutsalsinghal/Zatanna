import Web3 from 'web3';

let web3;
function networkCheck(){
  web3.eth.net.getNetworkType((err, netId) => {
    switch (netId) {
      case "main":
        alert("This is Mainnet. Please switch to Ropsten Test Network!");
        break
        case "ropsten":
        alert("This is Ropsten test network. Please switch to Rinkeby Test Network!");
        break
        case "rinkeby":
        //alert("Nice! You're now connected to Rinkeby Test Network!");
        break
      case "kovan":
        alert("This is Kovan test network. Please switch to Ropsten Test Network!");
        break
      default:
        alert('This is an unknown network. Please connect to Ropsten Test Network!');
    }
  })
}


if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
}else{
  // We are on the server *OR* the user is not running metamask
  alert("Please Install MetaMask from metamask.io");
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/fmYYH0aPRKNF5MFSuVNH');
  web3 = new Web3(provider);
}

networkCheck();

export default web3;