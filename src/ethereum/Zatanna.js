import web3 from './web3';
import Zatanna from './build/Zatanna.json';

const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0xc0f06264f21b283f2c8d8eb411fe768fe236f8dc");
//const ZatannaInstance = new web3.eth.Contract(JSON.parse(Zatanna.interface), "0x26f05c41a24a4f393584fea897ace39deb2281c2");
export default ZatannaInstance;
