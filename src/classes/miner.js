
import { Accounts, BlockList, Block } from './block.js';

const BLOCK_REWARD = 5.0;

export class Miner {
  accounts;
  blocks;
  
  constructor() {
    this.accounts = new Accounts();
    this.blocks = new BlockList();
  }

  mine(transactions, coinbase) {
    const block = new Block(coinbase);
    let reward = BLOCK_REWARD;
    transactions.forEach((transaction) => {
      block.add(transaction);
      this.accounts.transfer(transaction.from, transaction.to, transaction.amount, transaction.gas);
      reward += transaction.gas;
    });

    this.accounts.reward(coinbase, reward);
    this.blocks.add(block);
  }
}