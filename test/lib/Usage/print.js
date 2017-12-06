import test from 'ava';
import colors from 'chalk';
import { pad } from '../../../src/lib/Usage/print';

test('pad should trim regular strings', t => {
  t.is(pad('a', 3), 'a  ');
});

test('pad should trim formatted strings', t => {
  const coloredA = colors.red('a');
  t.is(pad(coloredA, 3), `${coloredA}  `);
});
