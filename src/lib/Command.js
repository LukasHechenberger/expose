import { UsageError } from './Error';

export default class Command {

  constructor(options = {}) {
    this.options = options;

    this.availableCommands = {};
    this.availableOptions = {};
  }

  handle(context) {
    if (!context.hasNextArg) {
      // FIXME: Validate required options
      return context;
    }

    const arg = context.pickNextArg();

    if (arg.isOption) {
      const option = this.availableOptions[arg.name];

      if (option) {
        return option.handle(context)
          .then(c => this.handle(c));
      }

      throw new UsageError(`Unknown option '${arg.name}'`, context);
    }

    const command = this.availableCommands[arg.name];

    if (command) {
      context.setCommand(command);
      return command.handle(context);
    }

    throw new UsageError(`Unknown argument '${arg.name}'`, context);
  }

  command(name, command) {
    Object.assign(command.options, { name });

    this.availableCommands[name] = command;
  }

  addOption(name, option) {
    Object.assign(option.options, { name });

    this.availableOptions[name] = option;
  }

  addOptions(options) {
    Object.entries(options)
      .forEach(([name, option]) => {
        this.addOption(name, option);
      });
  }

}
