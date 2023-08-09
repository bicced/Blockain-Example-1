const fs = require('fs');
const readline = require('readline');
const outputDirectory = './output';

const { createHash } = require('crypto');

const MINING_REWARD = 5.0;

let block = 0;
let hash = '0000000000000000000000000000000000000000000000000000000000000000';
const state = {};

function roundedSum(num1, num2) {
  return Math.round((num1 + num2) * 10000) / 10000;
};

function roundedSubtract(num1, num2) {
  return Math.round((num1 - num2) * 10000) / 10000;
};

function verifyPrevHash(prevHash) {
  if (prevHash !== hash) {
    throw new Error('Invalid previous hash!');
  }
};

function verifyCurrHash(currHash, blockData) {
  const blockText = blockData.join('\n');
  const expectedHash = createHash('sha256').update(blockText).digest('hex');
  if (currHash !== expectedHash) {
    throw new Error('Invalid current hash!');
  }
  hash = expectedHash;
};

function updateState(transactions) {
  transactions.forEach((transaction) => {
    const splitLine = transaction.split(' | ');
    const [type, from, to, amountString, feeString] = splitLine;
    const amount = parseFloat(amountString);
    const fee = parseFloat(feeString);
    const total = roundedSum(amount, fee);

    if (!state[from]) {
      state[from] = { balance: 0.0 };
    }

    if (type === 'coinbase') {
      state[from].balance = roundedSum(state[from].balance, MINING_REWARD);
    }

    if (type === 'transfer') {
      if (state[from].balance >= total) {
        if (!state[to]) {
          state[to] = { balance: 0.0 };
        }
        state[from].balance = roundedSubtract(state[from].balance, total);
        state[to].balance = roundedSum(state[to].balance, amount);
      } else {
        throw new Error('Insufficient funds');
      }
    }

  })
};

function verifyBlock() {
  const file =  fs.readFileSync(`${outputDirectory}/block${block}`, 'utf8');
  const lines = file.split('\n');
  const prevHash = lines[0];
  const currHash = lines[lines.length - 1];
  const blockData = lines.slice(0, lines.length - 1);
  const transactions = lines.slice(1, lines.length - 1);

  verifyPrevHash(prevHash);
  verifyCurrHash(currHash, blockData);
  updateState(transactions);
};

while (fs.existsSync(`${outputDirectory}/block${block}`)) {
  verifyBlock();
  block++;
};

const latestStateFile = fs.readFileSync(`${outputDirectory}/state.json`, 'utf8');
const latestState = JSON.parse(latestStateFile);

console.log(latestState);
console.log(state);
