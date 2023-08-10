import fs from 'fs';
import { Accounts } from './classes/block.js';
import { roundedSum } from './classes/utils.js';
import { createHash } from 'crypto';
import _ from 'lodash';

const MINING_REWARD = 5.0;

function verifyCurrHash(currHash, prevHash) {
  if (currHash !== prevHash) {
    throw new Error('Invalid previous hash!');
  }
};

function verifyNextHash(nextHash, blockData) {
  const blockText = blockData.join('\n');
  const expectedHash = createHash('sha256').update(blockText).digest('hex');
  if (nextHash !== expectedHash) {
    throw new Error('Invalid current hash!');
  }
};

function updateTransactions(blockData, accounts) {
  let reward = MINING_REWARD; 
  blockData.forEach(transaction => {
    const splitLine = transaction.split(' | ');
    const [type, from, to, amountString, feeString] = splitLine;
    if (type === 'coinbase') {
      accounts.reward(from, reward);
    }
    if (type === 'transfer') {
      reward = roundedSum(reward, parseFloat(feeString));
      accounts.transfer(from, to, parseFloat(amountString), parseFloat(feeString));
    }
  });
}

function verifyBlock(file, prevHash, accounts) {
  const lines = file.split('\n');
  const currHash = lines[0];
  const nextHash = lines[lines.length - 1];
  const blockData = lines.slice(0, lines.length - 1);
  verifyCurrHash(currHash, prevHash);
  verifyNextHash(nextHash, blockData);
  updateTransactions(blockData, accounts);
  return nextHash;
};

function verifyBlocks(outputDirectory, accounts) {
  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
  const files = fs.readdirSync(outputDirectory).filter((file) => file.includes('block'));
  files.forEach(file => {
    const fileContents = fs.readFileSync(`${outputDirectory}/${file}`, 'utf8');
    const nextHash = verifyBlock(fileContents, prevHash, accounts);
    prevHash = nextHash;
  });
}

function verifyState(outputDirectory, accounts) {
  const file = fs.readFileSync(`${outputDirectory}/state.json`, 'utf8');
  const state = JSON.parse(file);
  const accountsState = accounts.getState();
  if (!_.isEqual(state, accountsState)) {
    throw new Error('Invalid state!');
  }
}

function verifyBlockchain(outputDirectory) {
  const accounts = new Accounts();
  verifyBlocks(outputDirectory, accounts);
  console.log('Blocks are valid!');

  verifyState(outputDirectory, accounts);
  console.log('State is valid!');
}

verifyBlockchain('./output');



