import Command from './Command';
import Context from './Context';

export default class Expose extends Command {

  constructor(options = {}) {
    super(options);

    this.options.name = options.name || process.argv[1];
  }

  parse(args = true) {
    const argsToUse = (args === true) ?
      process.argv.slice(2) :
      args;

    const nonEmptyArgs = argsToUse.filter(a => a.length);

    const context = new Context(this, {
      args: nonEmptyArgs,
      config: {}, // FIXME: Insert config arg value
    });

    return Promise.resolve().then(() => this.handle(context));
  }

}
