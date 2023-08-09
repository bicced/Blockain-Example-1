import fs from 'fs';
import * as readline from 'node:readline/promises';
import { Accounts } from './types.js';
// const fs = require('fs');


const inputFilePath = './input.txt';
// const outputDirectory = './output';

// import class accounts

// const { createHash } = require('crypto');

// const MINING_REWARD = 5.0;

// let block = 0;
// let hash = '0000000000000000000000000000000000000000000000000000000000000000';
// let transactions = new Map();

// const state = {};

const file = readline.createInterface({
  input: fs.createReadStream(inputFilePath),
  crlfDelay: Infinity
});

// function roundedSum(num1, num2) {
//   return Math.round((num1 + num2) * 10000) / 10000;
// }

// function roundedSubtract(num1, num2) {
//   return Math.round((num1 - num2) * 10000) / 10000;
// }

// async function saveBlockAndState(line) {
//   // Sort transactions by fee
//   const sortedTransactions = Array.from(transactions.values()).sort((a, b) => b.fee - a.fee);
//   // Format blocks back to Text
//   const transactionText = sortedTransactions.map(t => Object.values(t).join(' | ')).join('\n');

//   // Add hash from previous block
//   let blockText = hash + '\n';

//   // Add transactions to block
//   if (transactionText.length > 0) {
//     blockText = blockText + transactionText + '\n';
//   }

//   // Add Mining Reward transaction to block
//   blockText = blockText + line;

//   // Create hash for current block
//   hash = createHash('sha256').update(blockText).digest('hex');

//   // Add hash to block
//   blockText = blockText + '\n' + hash;

//   // Save block to file
//   fs.writeFile(`${outputDirectory}/block${block}`, blockText, (err) => {
//     if (err) throw err;
//     console.log(`Block ${block} saved!`);
//   });

//   // Save state to file
//   fs.writeFile(`${outputDirectory}/state.json`, JSON.stringify(state), (err) => {
//     if (err) throw err;
//     console.log(`State of blockchain has been saved!`);
//   });
  
//   block++;
//   transactions.clear();
// }

// function processLine(line) {
//   const splitLine = line.split(' | ');
//   const [type, from, to, amountString, feeString] = splitLine;
//   const amount = parseFloat(amountString);
//   const fee = parseFloat(feeString);
//   const total = roundedSum(amount, fee);

//   if (!state[from]) {
//     state[from] = { balance: 0.0 };
//   }

//   if (type === 'transfer') {
//     // Verify that the sender has enough funds
//     if (state[from].balance >= total) {
//       // Add address to state if it doesn't exist
//       if (!state[to]) {
//         state[to] = { balance: 0.0 };
//       }
//       // Update balances in state
//       state[from].balance = roundedSubtract(state[from].balance, total);
//       state[to].balance = roundedSum(state[to].balance, amount);
//       // Add transaction to map
//       transactions.set(from, { type, from, to, amount, fee });
//     } else {
//       throw new Error('Insufficient funds');
//     }
//   }

//   if (type === 'coinbase') {
//     // Add mining reward to miner's balance
//     state[from].balance = roundedSum(state[from].balance, MINING_REWARD);
//     saveBlockAndState(line);
//   }
// }
const accounts = new Accounts();

function start() {
  console.log(accounts.toString());
};

//Process file line by line
file.on('line', start);
