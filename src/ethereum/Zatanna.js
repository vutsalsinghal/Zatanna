import web3 from './web3';
import Zatanna from './build/Zatanna.json';

const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x43a03bf3dca49657ae0657e0e6ab0e1310d8384e");
export default ZatannaInstance;
