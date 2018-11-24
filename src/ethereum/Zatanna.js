import web3 from './web3';
import Zatanna from './build/Zatanna.json';

//const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0xffe91f1c910eb0693eb533c7ed6391c19dd6a174");
const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x5fd1a646b0fc05a1cceac31bb6c0e4099a6f12e0");
export default ZatannaInstance;
