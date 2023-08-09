
import fs from 'fs';
import { createHash } from 'crypto';
import { roundedSubtract, roundedSum } from "./utils.js";
const outputDirectory = '../output';

let block_count = 0; 

export class Accounts {
  // Collection of accounts and their balances
  ledger: { [key: string]: number };

  constructor() {
    this.ledger = {};
  }

  toString() {
    return JSON.stringify(this.ledger);
  }

  reward(address: string, amount: number) {
    if (!this.ledger[address]) {
      this.ledger[address] = 0;
    }
    this.ledger[address] = roundedSum(this.ledger[address], amount);
  }

  transfer(from: string, to: string, amount: number, gas: number) {
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

class BlockList {
  // An ordered collection of blocks
  blocks: Block[];
  prev_hash: string;

  constructor() {
    this.blocks = [];
    this.prev_hash = "0000000000000000000000000000000000000000000000000000000000000000";
  }

  add(block: Block) {
    this.blocks.push(block);
    this.prev_hash = block.serialize(this.prev_hash);
  }
}

class Block {
  coinbase_address: string;
  block_number: number;
  transactions: Transfer[];

  constructor(coinbase_address: string) {
    this.block_number = block_count++;
    this.coinbase_address = coinbase_address;
  }

  add(transaction: Transfer) {
    this.transactions.push(transaction);
  }

  serialize(prevHash: string) {
    const sortedTransactions = this.transactions.sort((a, b) => b.gas - a.gas);
    const transactionText = sortedTransactions.map(t => Object.values(t).join(' | ')).join('\n');
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

    fs.writeFile(`${outputDirectory}/block${this.block_number}`, blockText, (err) => {
      if (err) throw err;
      console.log(`Block ${this.block_number} saved!`);
    });

    return hash;
  }
}

class Transfer {
  // Transfer of funds from one account to another
  type: string;
  from: string;
  to: string;
  amount: number;
  gas: number;

  constructor(from: string, to: string, amount: string, gas: string) {
    this.type = "transfer";
    this.from = from;
    this.to = to;
    this.amount = parseFloat(amount);
    this.gas = parseFloat(gas);
  }

  // Returns the transaction as a string
  toString() {
    return `${this.type} | ${this.from} | ${this.to} | ${this.amount} | ${this.gas}`
  }

}

class Coinbase {
  // Reward for mining a block
  type: string;
  address: string;

  constructor(address: string) {
    this.type = "coinbase";
    this.address = address;
  }

  // Returns the transaction as a string
  toString() {
    return `${this.type} | ${this.address}`
  }
}
