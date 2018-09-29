import web3 from './web3';
import Zatanna from './build/Zatanna.json';

const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x84b245dc3ddb3e1ea55d36c90687772173e70732");
export default ZatannaInstance;
