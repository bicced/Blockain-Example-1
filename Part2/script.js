const fs = require('fs');
const readline = require('readline');
const inputFilePath = 'input.txt';
const outputDirectory = './output';

const { createHash } = require('crypto');

const MINING_REWARD = 5.0;

let block = 0;
let hash = '0000000000000000000000000000000000000000000000000000000000000000';
let transactions = new Map();

const state = {};

const fileByLine = readline.createInterface({
  input: fs.createReadStream(inputFilePath),
  crlfDelay: Infinity
});

function roundedSum(num1, num2) {
  return Math.round((num1 + num2) * 10000) / 10000;
}

function roundedSubtract(num1, num2) {
  return Math.round((num1 - num2) * 10000) / 10000;
}

async function saveBlockAndState(line) {
  const sortedTransactions = Array.from(transactions.values()).sort((a, b) => b.fee - a.fee);
  const transactionText = sortedTransactions.map(t => Object.values(t).join(' | ')).join('\n');

  let blockText = hash + '\n';

  if (transactionText.length > 0) {
    blockText = blockText + transactionText + '\n';
  }

  hash = createHash('sha256').update(blockText).digest('hex');

  blockText = blockText + line + '\n' + hash;

  fs.writeFile(`${outputDirectory}/block${block}`, blockText, (err) => {
    if (err) throw err;
    console.log(`Block ${block} saved!`);
  });

  fs.writeFile(`${outputDirectory}/state.json`, JSON.stringify(state), (err) => {
    if (err) throw err;
    console.log(`State of blockchain has been saved!`);
  });

  block++;
  transactions.clear();
}

function processLine(line) {
  const splitLine = line.split(' | ');
  const [type, from, to, amountString, feeString] = splitLine;
  const amount = parseFloat(amountString);
  const fee = parseFloat(feeString);
  const total = roundedSum(amount, fee);

  if (!state[from]) {
    state[from] = { balance: 0.0 };
  }

  if (type === 'transfer') {
    if (state[from].balance >= total) {
      if (!state[to]) {
        state[to] = { balance: 0.0 };
      }
      state[from].balance = roundedSubtract(state[from].balance, total);
      state[to].balance = roundedSum(state[to].balance, amount);
      transactions.set(from, { type, from, to, amount, fee });
    } else {
      throw new Error('Insufficient funds');
    }
  }

  if (type === 'coinbase') {
    state[from].balance = roundedSum(state[from].balance, MINING_REWARD);
    saveBlockAndState(line);
  }
}

fileByLine.on('line', processLine);
