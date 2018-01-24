'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Error = require('./Error');

var _Describable = require('./Usage/Describable');

var _AliasStorage = require('./Command/AliasStorage');

var _AliasStorage2 = _interopRequireDefault(_AliasStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line
class Command extends _Describable.DescribableAlias {

  constructor(options) {
    super(options);

    this.commands = new _AliasStorage2.default();
    this.options = new _AliasStorage2.default();
    this._action = options.run;

    if (options.options) {
      this.addOptions(options.options);
    }
  }

  async handleArg(arg, context) {
    if (arg.isOption) {
      const option = this.options.get(arg.name);

      if (option) {
        return option.handle(context).then(c => context._command.handle(c));
      }

      const parentCommand = context.getParentCommand(this);
      if (parentCommand) {
        // FIXME: && option propagate is set
        return parentCommand.handleArg(arg, context);
      }

      throw new _Error.UsageError(`Unknown option '${arg.raw}'`, context);
    }

    const command = this.commands.get(arg.name);

    if (command) {
      context.setCommand(command);
      return command.handle(context);
    }

    throw new _Error.UsageError(`Unknown argument '${arg.raw}'`, context);
  }

  async handle(context) {
    const arg = context.pickNextArg();

    if (!arg) {
      // FIXME: Validate required options
      return Promise.resolve(context);
    }

    return this.handleArg(arg, context);
  }

  addCommand(command) {
    this.commands.add(command);
  }

  addOption(option) {
    this.options.add(option);
  }

  addOptions(options) {
    options.forEach(o => this.addOption(o));
  }

  get action() {
    return this._action;
  }

}
exports.default = Command;