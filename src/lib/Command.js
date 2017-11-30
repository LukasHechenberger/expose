import { UsageError } from './Error';
import { DescribableAlias } from './Usage/Describable';
import AliasStorage from './Command/AliasStorage';
import type { DescribableAliasOptions } from './Usage/Describable'; // eslint-disable-line
import type Option from './Option';
import type Context from './Context';
import type { ArgumentHandler } from './ArgumentHandler';

export default class Command extends DescribableAlias implements ArgumentHandler {

  commands: AliasStorage<Command>
  options: AliasStorage<Option<any>>

  constructor(options: DescribableAliasOptions) {
    super(options);

    this.commands = new AliasStorage();
    this.options = new AliasStorage();
  }

  async handle(context: Context): Promise<Context> {
    const arg = context.pickNextArg();

    if (!arg) {
      // FIXME: Validate required options
      return Promise.resolve(context);
    }

    if (arg.isOption) {
      const option: ?Option<any> = this.options.get(arg.name);

      if (option) {
        return option.handle(context)
          .then((c: Context) => this.handle(c));
      }

      throw new UsageError(`Unknown option '${arg.name}'`, context);
    }

    const command: ?Command = this.commands.get(arg.name);

    if (command) {
      context.setCommand(command);
      return command.handle(context);
    }

    throw new UsageError(`Unknown argument '${arg.name}'`, context);
  }

  addCommand(command: Command) {
    this.commands.add(command);
  }

  addOption(option: Option<*>) {
    this.options.add(option);
  }

  addOptions(options: Option<*>[]) {
    options.forEach((o: Option<*>) => this.addOption(o));
  }

}
