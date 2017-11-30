const argRegExp = /(-+)?(no-)?([^=]+)(?:=(.+))?/;

export class ParsedArg {

  constructor(rawArg) {
    const match = rawArg.match(argRegExp);

    this.raw = rawArg;
    this.isOption = !!match[1];
    this.isNegated = !!match[2];
    this.name = match[3];
    this.value = match[4];
  }

  get hasValue() {
    return this.value !== undefined;
  }

}

export default class Context {

  constructor(command, { config = {}, args = [] } = {}) {
    this._config = config;
    this._args = args.map(raw => new ParsedArg(raw));

    // Results
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
    if (this.hasNextArg) {
      this._currentArg = this._args.shift();
      return this._currentArg;
    }

    return undefined;
  }

  // Options
  setOption(name, value) {
    this.options[name] = value;
  }

  setCommand(command) {
    this._command = command;
    this._commandPath.push(command);
  }

  // Usage
  get usage() {
    const indent = '  ';
    const commandPath = this._commandPath
      .map(command => command.options.name)
      .join(' ');

    let lines = [`Usage: ${commandPath}`];

    // FIXME: Add command description

    const availableCommands = Object.values(this._command.availableCommands);
    if (availableCommands.length) {
      lines.push('', 'Available commands:', '');

      lines = lines.concat(availableCommands
        // FIXME: Add command description
        .map(({ options }) => `${indent}${options.name} [Missing description]`)
      );
    }

    const availableOptions = Object.values(this._command.availableOptions);
    if (availableOptions.length) {
      lines.push('', 'Available options:', '');

      lines = lines.concat(availableOptions
        // FIXME: Add option description
        .map(({ options }) => `${indent}--${options.name} [Missing description]`)
      );
    }

    const globalOptions = this._commandPath.slice(0, this._commandPath.length - 1)
      .reduce((opts, command) => opts.concat(Object.values(command.availableOptions)), []);

    if (globalOptions.length) {
      lines.push('', 'Global options:', '');


      lines = lines.concat(globalOptions
        // FIXME: Add option description
        .map(({ options }) => `${indent}--${options.name} [Missing description]`)
      );
    }

    return lines.join('\n');
  }

}
