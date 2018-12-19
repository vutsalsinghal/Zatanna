import web3 from './web3';
import Zatanna from './build/Zatanna.json';

//const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0xffe91f1c910eb0693eb533c7ed6391c19dd6a174");
const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x5453353b1628c5cfcb4537926891edc5f5e55096");
export default ZatannaInstance;
