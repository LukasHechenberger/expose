import { UsageError } from './Error';
import { DescribableAlias } from './Usage/Describable';
import AliasStorage from './Command/AliasStorage';
import type { DescribableAliasOptions } from './Usage/Describable'; // eslint-disable-line
import type Option from './Option';
import type Context, { ParsedArg, RunAction } from './Context';
import type { ArgumentHandler } from './ArgumentHandler';

export type CommandOptions = DescribableAliasOptions & {
  run?: RunAction,
  options?: Option<*>[],
}

export default class Command extends DescribableAlias implements ArgumentHandler {

  commands: AliasStorage<Command>
  options: AliasStorage<Option<any>>
  _action: ?RunAction

  constructor(options: CommandOptions) {
    super(options);

    this.commands = new AliasStorage();
    this.options = new AliasStorage();
    this._action = options.run;

    if (options.options) {
      this.addOptions(options.options);
    }
  }

  async handleArg(arg: ParsedArg, context: Context): Promise<Context> {
    if (arg.isOption) {
      const option: ?Option<any> = this.options.get(arg.name);

      if (option) {
        return option.handle(context)
          .then((c: Context) => context._command.handle(c));
      }

      const parentCommand = context.getParentCommand(this);
      if (parentCommand) { // FIXME: && option propagate is set
        return parentCommand.handleArg(arg, context);
      }

      throw new UsageError(`Unknown option '${arg.raw}'`, context);
    }

    const command: ?Command = this.commands.get(arg.name);

    if (command) {
      context.setCommand(command);
      return command.handle(context);
    }

    throw new UsageError(`Unknown argument '${arg.raw}'`, context);
  }

  async handle(context: Context): Promise<Context> {
    const arg = context.pickNextArg();

    if (!arg) {
      // FIXME: Validate required options
      return Promise.resolve(context);
    }

    return this.handleArg(arg, context);
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

  get action(): ?RunAction {
    return this._action;
  }

}
