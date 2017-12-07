import colors from 'chalk';
import Command from './Command';
import Context from './Context';
import BooleanOption from './Options/Boolean';
import { UsageError, ImplementationError } from './Error';
import type { TypedOptionOptions } from './Option';

type ExposeOptions = {
  description?: string,
}

export default class Expose extends Command {

  _context: ?Context
  logger: {
    +log: (...data: Array<any>) => void,
    +error: (...data: Array<any>) => void
  }

  constructor(options: ExposeOptions) {
    const name: string = process.argv[1];

    super(Object.assign({}, { name }, options));

    this.logger = console;
  }

  parse(args: true | string[] = true): Promise<Context> {
    const argsToUse: string[] = (args === true) ?
      process.argv.slice(2) :
      args;

    const nonEmptyArgs: string[] = argsToUse.filter(a => a.length);

    this._context = new Context(this, {
      args: nonEmptyArgs,
      config: {}, // FIXME: Insert config arg value
    });

    return this.handle(this._context);
  }

  printUsage(err: ?Error = undefined, exitCode: number = 1) {
    if (err) {
      if (err instanceof UsageError) {
        this.logger.error(err.context.getUsage());
      } else if (this._context) {
        this.logger.error(this._context.getUsage());
      }

      this.logger.error('');
      this.logger.error(colors.red(err.message));

      process.exitCode = exitCode;
      return;
    }

    if (this._context) {
      this.logger.log(this._context.getUsage());
    } else {
      throw new Error('No arguments parsed yet');
    }
  }

  async run({ args }: { args?: string[] } = {}): Promise<any> {
    let context: ?Context;

    try {
      context = await this.parse(args);

      if (!context.hasAction) {
        if (context.currentCommand === this) {
          throw new UsageError('No command specified', context);
        } else {
          throw new ImplementationError('No action for current command', context);
        }
      }
    } catch (err) {
      this.printUsage(err);
      context = null;
    }

    if (context) {
      return context.execute();
    }

    return null;
  }

  // Concrete options

  addVersion(version: string, { name, alias, description }: OptionOverrideOptions = {}) {
    this.addOption(new BooleanOption({
      name: name || 'version',
      alias: alias || 'v',
      description: description || 'Print version',
      run: () => this.logger.log(version),
    }));
  }

  addHelp({ name, alias, description }: OptionOverrideOptions = {}) {
    this.addOption(new BooleanOption({
      name: name || 'help',
      alias: alias || 'h',
      description: description || 'Show help',
      run: context => this.logger.log(`${context.getUsage()}\n`),
    }));
  }

}

type OptionOverrideOptions = {
  ...TypedOptionOptions,
  name?: string
};
