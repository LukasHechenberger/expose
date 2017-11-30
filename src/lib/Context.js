import type Command from './Command';
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

  constructor(command: Command, { config = {}, args = [] }: { config: {}, args: string[] } = {}) {
    this._config = config;
    this._args = args.map(raw => new ParsedArg(raw));
    this._processedArgs = [];

    // Results
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

  // Options
  setOption(name: string, value: OptionValue) {
    this.options[name] = value;
  }

  setCommand(command: Command) {
    this._command = command;
    this._commandPath.push(command);
  }

  // Usage
  get usage(): string {
    const indent: string = '  ';
    const commandPath = this._commandPath
      .map((command: Command) => command.name)
      .join(' ');

    let lines: string[] = [`Usage: ${commandPath}`];

    if (this._command.description.length) {
      lines.push(this._command.description);
    }

    // FIXME: Add command description

    const availableCommands = this._command.commands;
    if (availableCommands.length) {
      lines.push('', 'Available commands:', '');

      lines = lines.concat(availableCommands.toArray()
        // FIXME: Add command description
        .map((command: Command) => `${indent}${command.name} ${command.description}`)
      );
    }

    const availableOptions: * = this._command.options.toArray();
    if (availableOptions.length) {
      lines.push('', 'Available options:', '');

      lines = lines.concat(availableOptions
        // FIXME: Add option description
        .map((option: *) => `${indent}--${option.name} ${option.description} [${option.constructor.typeName}]`)
      );
    }

    const globalOptions: Option<any>[] = this._commandPath.slice(0, this._commandPath.length - 1)
      .reduce((opts, command: Command) => opts
        .concat(command.options.toArray()),
      []);

    if (globalOptions.length) {
      lines.push('', 'Global options:', '');

      lines = lines.concat(globalOptions
        // FIXME: Add option description
        .map((option: *) => `${indent}--${option.name} ${option.description} [${option.constructor.typeName}]`)
      );
    }

    return lines.join('\n');
  }

}
