# @ls-age/expose

> **Work in progress**
>
> The easy way to expose a module for CLI usage

## Installation

```bash
npm install --save @ls-age/expose
```

## Usage

```javascript
import Expose, { Command, Number } from '@ls-age/expose';
import { version, description } from '../package.json';

const cli = new Expose({ description });
cli.addHelp();
cli.addVersion(version);

const testCommand = new Command({
  name: 'test',
  description: 'Just for testing',
  alias: 'try',
  run({ options }) {
    console.log('Running test command with options', options);
  },
});
testCommand.addOption(new Number({
  name: 'log-level',
  description: 'Set log level',
  alias: 'l',
  async set(level) {
    console.log('Setting log level to', level);

    // Setting the log level takes some time, so we use an async function
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Log level was set');
  },
}));
cli.addCommand(testCommand);

cli.run();
```
