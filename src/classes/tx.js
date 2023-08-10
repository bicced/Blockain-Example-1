export class Transfer {
  // Transfer of funds from one account to another
  type;
  from;
  to;
  amount;
  gas;

  constructor(from, to, amount, gas) {
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

export class Coinbase {
  // Reward for mining a block
  type;
  address;

  constructor(address) {
    this.type = "coinbase";
    this.address = address;
  }

  // Returns the transaction as a string
  toString() {
    return `${this.type} | ${this.address}`
  }
}

