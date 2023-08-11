import test from 'tape';
import { Miner } from '../src/classes/miner.js';
import { Coinbase, Transfer } from '../src/classes/tx.js';

test('Blockchain', (t) => {
  t.plan(1);
  t.equal(1, 1, 'should be equal');
});

test('Miner', (t) => {
  t.plan(1);

  const m = new Miner();
  m.mine([], new Coinbase('0x0a'));

  t.equal(m.accounts.ledger, { '0x0a': 1 }, 'should be equal');

  // const tx = [];
  // tx.push(new Transfer('0x0a', '0x0b', 2));
  // tx.push(new Coinbase('0x0c'));
  //

})
