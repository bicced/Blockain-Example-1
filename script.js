const fs = require('fs');
const readline = require('readline');

const input = fs.createReadStream('input.txt');

const fileByLine = readline.createInterface({
  input,
  crlfDelay: Infinity
});

const MINING_REWARD = 5.0;

let block = 0;
let transactions = [];

const state = {

};

fileByLine.on('line', (line) => {
  const splitLine = line.split(' | ');
  const type = splitLine[0];
  const from = splitLine[1];

  if (!state[from]) {
    state[from] = {
      balance: 0.0
    };
  }

  if (type === 'transfer') {
    const to = splitLine[2];
    const amount = parseFloat(splitLine[3]);
    const fee = parseFloat(splitLine[4]);
    const total = amount + fee;

    if (state[from].balance >= total) {
      if (!state[to]) {
        state[to] = {
          balance: 0.0
        };
      }
      state[from].balance -= total;
      state[to].balance += amount;
      transactions.push(splitLine);
    } else {
      throw new Error('Insufficient funds');
    }
  }

  if (type === 'coinbase') {
    state[from].balance += MINING_REWARD;
    let text = '';

    transactions.sort((a, b) => {
      return parseFloat(b[4]) - parseFloat(a[4]);
    }).map((transaction) => {
      text += `${transaction[0]} | ${transaction[1]} | ${transaction[2]} | ${transaction[3]} | ${transaction[4]}\n`;
    });

    text += line;

    fs.writeFile(`./output/block${block}`, text, (err) => {
      if (err) throw err;
      console.log('A block has been saved!');
    });

    block++;
    transactions = [];
  }
  fs.writeFile(`./output/state.json`, JSON.stringify(state), (err) => {
    if (err) throw err;
    console.log('Latest state has been saved');
  });
});
