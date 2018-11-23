import web3 from './web3';
import Zatanna from './build/Zatanna.json';

const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x796503217dcd218f1db0287ed1c764bc8b775fca");
//const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x272fe70fd7576687daccdb725509c541af6c4c7a");
export default ZatannaInstance;
