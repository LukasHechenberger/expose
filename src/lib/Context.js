import Table from './Usage/Table';
import print from './Usage/print';
import { header, section, desc } from './Usage/format';
import type { Printable } from './Usage/print'; // eslint-disable-line
import type Command from './Command';
import type Expose from './Expose';
import type Option, { OptionValue } from './Option';

const argRegExp = /(-+)?(no-)?([^=]+)(?:=(.+))?/;

export class ParsedArg {

  raw: string
  isOption: boolean
  isShortOption: boolean
  isNegated: boolean
  name: string
  value: ?string
  hasValue: boolean

  constructor(rawArg: string) {
    const match = rawArg.match(argRegExp);

    if (!match) {
      throw new Error('RegExp did not match argument');
    }

    this.raw = rawArg;
    this.isOption = !!match[1];
    this.isShortOption = (match[1] && match[1].length === 1) || false;
    this.isNegated = !!match[2];
    this.name = match[3];
    this.value = match[4];
    this.hasValue = !!this.value;
  }

}

export default class Context {

  _config: {}
  _args: Array<ParsedArg>
  _processedArgs: Array<ParsedArg>
  options: { [string]: OptionValue }
  _command: Command
  _commandPath: Command[]
  _currentArg: ?ParsedArg
  _action: ?RunAction
  +cli: Expose

  constructor(command: Expose, { config = {}, args = [] }: { config: {}, args: string[] } = {}) {
    this._config = config;
    this._args = args.map(raw => new ParsedArg(raw));
    this._processedArgs = [];
    this.cli = command;

    // State
    this.options = {};
    this._command = command;
    this._commandPath = [command];
  }

  get currentArg(): ?ParsedArg {
    return this._currentArg;
  }

  get hasNextArg(): boolean {
    return this._args.length > 0;
  }

  get nextArg(): ?ParsedArg {
    return this._args[0];
  }

  pickNextArg(): ?ParsedArg {
    if (this._currentArg) {
      this._processedArgs.push(this._currentArg);
    }

    if (this.hasNextArg) {
      this._currentArg = this._args.shift();
      return this._currentArg;
    }

    return undefined;
  }

  get currentCommand(): Command {
    return this._command;
  }

  getParentCommand(command: Command): ?Command {
    const index = this._commandPath.indexOf(command);

    if (index >= 1) {
      return this._commandPath[index - 1];
    }

    return null;
  }

  // Handlers
  setAction(action: RunAction) {
    if (!this._action) {
      this._action = action;
    }
  }

  get hasAction(): boolean {
    return !!this._action || !!this.currentCommand.action;
  }

  execute(): any {
    const action = this._action || this.currentCommand.action;

    if (!action) {
      throw new Error('No handler registered');
    }

    return action(this);
  }

  // Options
  setOption(optionName: string, value: OptionValue) {
    this.options[optionName] = value;
  }

  setCommand(command: Command) {
    this._command = command;
    this._commandPath.push(command);
  }

  // Usage
  getUsage(): string {
    const indent: string = '  ';
    const commandPath = this._commandPath
      .map((command: Command) => command.name)
      .join(' ');

    const table = new Table({ indent });
    table.setAlign('right', 2);

    let lines: Array<string | Printable> = [`Usage: ${header(commandPath)}`];

    if (this._command.description.length) {
      lines.push('', desc(`${indent}${this._command.description}`));
    }

    const availableCommands = this._command.commands.toArray();
    if (availableCommands.length) {
      lines.push('', section('Available commands:'), '');

      lines = lines.concat(availableCommands
        .map((command: Command) => table.addLine(command.usageInfo))
      );
    }

    const availableOptions: * = this._command.options.toArray();
    if (availableOptions.length) {
      lines.push('', section('Available options:'), '');

      lines = lines.concat(availableOptions
        .map(option => table.addLine(option.usageInfo))
      );
    }

    const globalOptions: Option<any>[] = this._commandPath.slice(0, this._commandPath.length - 1)
      .reduce((opts, command: Command) => opts
        .concat(command.options.toArray()),
      []);

    if (globalOptions.length) {
      lines.push('', section('Global options:'), '');

      lines = lines.concat(globalOptions
        .map(option => table.addLine(option.usageInfo))
      );
    }

    return print(lines);
  }

}

export type RunAction = (context: Context) => any
