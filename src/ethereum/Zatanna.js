import web3 from './web3';
import Zatanna from './build/Zatanna.json';

const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x5483551ec25247d607e113191e02a4507a419fd3");
export default ZatannaInstance;
