const fs = require('fs');
const readline = require('readline');
const inputFilePath = 'input.txt';
const outputDirectory = './output';

const MINING_REWARD = 5.0;

let block = 0;
let transactions = new Map();

const state = {};

const fileByLine = readline.createInterface({
  input: fs.createReadStream(inputFilePath),
  crlfDelay: Infinity
});

function roundedSum(num1, num2) {
  return Math.round((num1 + num2) * 100) / 100;
}

function roundedSubtract(num1, num2) {
  return Math.round((num1 - num2) * 10000) / 10000;
}

async function saveBlockAndState(line) {
  const sortedTransactions = Array.from(transactions.values()).sort((a, b) => b.fee - a.fee);
  const transactionText = sortedTransactions.map(t => Object.values(t).join(' | ')).join('\n');
  // console.log(transactionText);

  let blockText = line;
  console.log('transactionText: ' + transactionText)
  if (transactionText.length > 0) {
    blockText = transactionText + '\n' + line;
  }

  console.log('blockText:', blockText)
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
  const amount = parseFloat(splitLine[3]);
  const fee = parseFloat(splitLine[4]);
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
