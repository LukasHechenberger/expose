import Command from './Command';
import Context from './Context';

type ExposeOptions = {
  description?: string,
}

export default class Expose extends Command {

  constructor(options: ExposeOptions) {
    const name: string = process.argv[1];

    super(Object.assign({}, { name }, options));
  }

  parse(args: true | string[] = true): Promise<Context> {
    const argsToUse: string[] = (args === true) ?
      process.argv.slice(2) :
      args;

    const nonEmptyArgs: string[] = argsToUse.filter(a => a.length);

    const context = new Context(this, {
      args: nonEmptyArgs,
      config: {}, // FIXME: Insert config arg value
    });

    return this.handle(context);
  }

}
