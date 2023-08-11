import fs from 'fs';
import { createHash } from 'crypto';
import { roundedSubtract, roundedSum } from "./utils.js";
const outputDirectory = './output';

let block_count = 0;

export class Accounts {
  // Collection of accounts and their balances
  ledger;

  constructor() {
    this.ledger = {};
  }

  getState() {
    return this.ledger;
  }

  reward(address, amount) {
    if (!this.ledger[address]) {
      this.ledger[address] = 0;
    }
    this.ledger[address] = roundedSum(this.ledger[address], amount);
  }

  transfer(from, to, amount, gas) {
    //If the account does not exist, or does not have enough funds - throw an error
    if (!this.ledger[from] || this.ledger[from] < amount) {
      throw new Error('Account does not have any funds');
    }

    // Add to address if it doesn't exist
    if (!this.ledger[to]) {
      this.ledger[to] = 0;
    }

    const total = roundedSum(amount, gas);

    // Update balances in state
    this.ledger[from] = roundedSubtract(this.ledger[from], total);
    this.ledger[to] = roundedSum(this.ledger[to], amount);
  }

  serialize() {
    fs.writeFile(`${outputDirectory}/state.json`, JSON.stringify(this.ledger), (err) => {
      if (err) throw err;
      console.log(`State of blockchain has been saved!`);
    });
  }
}

export class BlockList {
  // An ordered collection of blocks
  blocks;
  prev_hash;

  constructor() {
    this.blocks = [];
    this.prev_hash = "0000000000000000000000000000000000000000000000000000000000000000";
  }

  add(block) {
    this.blocks.push(block);
    this.prev_hash = block.serialize(this.prev_hash);
  }
}

export class Block {
  // A block of transactions that is added to the blockchain
  coinbase_address;
  block_number;
  transactions;

  constructor(coinbase_address) {
    this.block_number = block_count++;
    this.coinbase_address = coinbase_address;
    this.transactions = [];
  }

  add(transaction) {
    this.transactions.push(transaction);
  }

  // TODO: This function has two responsibilities: 1) generate new hash, & 2) save block to file.
  // Recommendation: split this function into two functions.
  // Impact: Will allow for easier testing of hash generation because it will be decoupled from file system.
  //
  serialize(prevHash) {
    const transactionText = this.transactions.map(t => Object.values(t).join(' | ')).join('\n');
    let blockText = prevHash + '\n';

    if (transactionText.length > 0) {
      blockText = blockText + transactionText + '\n';
    }

    // Add Mining Reward transaction to block
    blockText = blockText + `coinbase | ${this.coinbase_address}`;

    // Create hash for current block
    const hash = createHash('sha256').update(blockText).digest('hex');

    // Add hash to block
    blockText = blockText + '\n' + hash;

    console.log(blockText)

    fs.writeFile(`${outputDirectory}/block${this.block_number}`, blockText, (err) => {
      if (err) throw err;
      console.log(`Block ${this.block_number} saved!`);
    });

    return hash;
  }
}
