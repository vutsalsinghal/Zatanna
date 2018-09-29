import web3 from './web3';
import Zatanna from './build/Zatanna.json';

const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x90259d1deaeea7ebc8f047f950418db099cba0a0");
export default ZatannaInstance;
