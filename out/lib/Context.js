'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParsedArg = undefined;

var _Table = require('./Usage/Table');

var _Table2 = _interopRequireDefault(_Table);

var _print = require('./Usage/print');

var _print2 = _interopRequireDefault(_print);

var _format = require('./Usage/format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line
const argRegExp = /(-+)?(no-)?([^=]+)(?:=(.+))?/;
class ParsedArg {

  constructor(rawArg) {
    const match = rawArg.match(argRegExp);

    if (!match) {
      throw new Error('RegExp did not match argument');
    }

    this.raw = rawArg;
    this.isOption = !!match[1];
    this.isShortOption = match[1] && match[1].length === 1 || false;
    this.isNegated = !!match[2];
    this.name = match[3];
    this.value = match[4];
    this.hasValue = !!this.value;
  }

}

exports.ParsedArg = ParsedArg;
class Context {

  constructor(command, { config = {}, args = [] } = {}) {
    this._config = config;
    this._args = args.map(raw => new ParsedArg(raw));
    this._processedArgs = [];
    this.cli = command;

    // State
    this.options = {};
    this._command = command;
    this._commandPath = [command];
  }

  get currentArg() {
    return this._currentArg;
  }

  get hasNextArg() {
    return this._args.length > 0;
  }

  get nextArg() {
    return this._args[0];
  }

  pickNextArg() {
    if (this._currentArg) {
      this._processedArgs.push(this._currentArg);
    }

    if (this.hasNextArg) {
      this._currentArg = this._args.shift();
      return this._currentArg;
    }

    return undefined;
  }

  get currentCommand() {
    return this._command;
  }

  getParentCommand(command) {
    const index = this._commandPath.indexOf(command);

    if (index >= 1) {
      return this._commandPath[index - 1];
    }

    return null;
  }

  // Handlers
  setAction(action) {
    if (!this._action) {
      this._action = action;
    }
  }

  get hasAction() {
    return !!this._action || !!this.currentCommand.action;
  }

  execute() {
    const action = this._action || this.currentCommand.action;

    if (!action) {
      throw new Error('No handler registered');
    }

    return Promise.resolve().then(() => action(this));
  }

  // Options
  setOption(optionName, value) {
    this.options[optionName] = value;
  }

  setCommand(command) {
    this._command = command;
    this._commandPath.push(command);
  }

  // Usage
  getUsage() {
    const indent = '  ';
    const commandPath = this._commandPath.map(command => command.name).join(' ');

    const table = new _Table2.default({ indent });
    table.setAlign('right', 2);

    let lines = [`Usage: ${(0, _format.header)(commandPath)}`];

    if (this._command.description.length) {
      lines.push('', (0, _format.desc)(`${indent}${this._command.description}`));
    }

    const availableCommands = this._command.commands.toArray();
    if (availableCommands.length) {
      lines.push('', (0, _format.section)('Available commands:'), '');

      lines = lines.concat(availableCommands.map(command => table.addLine(command.usageInfo)));
    }

    const availableOptions = this._command.options.toArray();
    if (availableOptions.length) {
      lines.push('', (0, _format.section)('Available options:'), '');

      lines = lines.concat(availableOptions.map(option => table.addLine(option.usageInfo)));
    }

    const globalOptions = this._commandPath.slice(0, this._commandPath.length - 1).reduce((opts, command) => opts.concat(command.options.toArray()), []);

    if (globalOptions.length) {
      lines.push('', (0, _format.section)('Global options:'), '');

      lines = lines.concat(globalOptions.map(option => table.addLine(option.usageInfo)));
    }

    return (0, _print2.default)(lines);
  }

}

exports.default = Context;