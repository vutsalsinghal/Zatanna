import web3 from './web3';
import Zatanna from './build/Zatanna.json';

const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0xffe91f1c910eb0693eb533c7ed6391c19dd6a174");
//const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x272fe70fd7576687daccdb725509c541af6c4c7a");
export default ZatannaInstance;
