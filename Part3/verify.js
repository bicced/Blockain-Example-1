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
};

function updateState(transactions, miner) {
};

function verifyBlock() {
  const file =  fs.readFileSync(`${outputDirectory}/block${block}`, 'utf8');
  const lines = file.split('\n');
  const prevHash = lines[0];
  const currHash = lines[lines.length - 1];
  const blockData = lines.slice(0, lines.length - 1);
  // const miner = lines[lines.length - 2];

  verifyPrevHash(prevHash);
  verifyCurrHash(currHash, blockData);
  // updateState(transactions, miner);
  console.log('-------------------');
};

while (fs.existsSync(`${outputDirectory}/block${block}`)) {
  verifyBlock();
  block++;
};
