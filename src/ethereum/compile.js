const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // deletes build folder if it exists

const attendancecoinPath = path.resolve(__dirname, 'contracts', 'Zatanna.sol');
const source = fs.readFileSync(attendancecoinPath, 'utf-8');

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
    console.log(contract);
    fs.outputJsonSync(path.resolve(buildPath, contract.replace(':', '') + '.json'), output[contract]);
}