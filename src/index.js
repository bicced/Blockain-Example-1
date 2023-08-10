import fs from 'fs';
import { Transfer } from './classes/tx.js';
import { Miner } from './classes/miner.js';

const inputFilePath = './input.txt';

const miner = new Miner();

const file =  fs.readFileSync(inputFilePath, 'utf8');
const lines = file.split('\n');
let transactions = [];

function processLine(line) {
  const splitLine = line.split(' | ');
  const [type, from, to, amountString, feeString] = splitLine;
  
  if (type === 'coinbase') {
    miner.mine(transactions, from);
    transactions = [];
  }
  
  if (type === 'transfer') {
    const newTransfer = new Transfer(from, to, amountString, feeString);
    transactions.push(newTransfer);
  }
}

lines.forEach(line => {
  processLine(line);
});

miner.accounts.serialize();


