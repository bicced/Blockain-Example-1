import test from 'tape';
import { Miner } from '../src/classes/miner.js';
import { Coinbase, Transfer } from '../src/classes/tx.js';

test('Miner', (t) => {
  const m = new Miner({ persist: false });
  m.mine([], new Coinbase('0x0a'));

  let expectedLedger = { '0x0a': 5 };
  t.deepEqual(
    m.accounts.ledger, 
    expectedLedger, 
    'Ledger should reward miner for mining genesis block'
  );


  const txns = [];
  txns.push(new Transfer('0x0a', '0x0b', 2, 0.1));
  m.mine(txns, new Coinbase('0x0c'));
  expectedLedger = { '0x0a': 2.9, '0x0b': 2, '0x0c': 5.1 };
  t.deepEqual(
    m.accounts.ledger, 
    expectedLedger, 
    'Ledger updates correctly after mining a block with a transfer'
  );
  t.end();

})
