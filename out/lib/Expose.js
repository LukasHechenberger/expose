'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logger = require('@ls-age/logger');

var _Command = require('./Command');

var _Command2 = _interopRequireDefault(_Command);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Boolean = require('./Options/Boolean');

var _Boolean2 = _interopRequireDefault(_Boolean);

var _Error = require('./Error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line
class Expose extends _Command2.default {

  constructor(options) {
    const name = process.argv[1];

    super(Object.assign({}, { name }, options));

    this.logger = new _logger.Logger({ timestamp: false }).pipe(process.stdout);

    if (options.onResult) {
      this._resultHandler = options.onResult;
    }

    if (options.onError) {
      this._errorHandler = options.onError;
    }

    if (options.help) {
      this.addHelp();
    }

    if (options.version) {
      this.addVersion(options.version);
    }
  }

  parse(args = true) {
    const argsToUse = args === true ? process.argv.slice(2) : args;

    const nonEmptyArgs = argsToUse.filter(a => a.length);

    this._context = new _Context2.default(this, {
      args: nonEmptyArgs,
      config: {} // FIXME: Insert config arg value
    });

    return this.handle(this._context);
  }

  printUsage(err = undefined, exitCode = 1) {
    if (err) {
      if (err instanceof _Error.UsageError) {
        this.logger.error(err.context.getUsage());
      } else if (this._context) {
        this.logger.error(this._context.getUsage());
      }

      this.logger.error('');
      this.logger.error(_chalk2.default.red(err.message));

      if (err instanceof _Error.UsageError) {
        const info = err.additionalInfo;

        if (info) {
          this.logger.error(_chalk2.default.gray(info));
        }
      }

      process.exitCode = exitCode;
      return;
    }

    if (this._context) {
      this.logger.info(this._context.getUsage());
    } else {
      throw new Error('No arguments parsed yet');
    }
  }

  async run({ args } = {}) {
    let context;

    try {
      context = await this.parse(args);

      if (!context.hasAction) {
        if (context.currentCommand === this) {
          throw new _Error.UsageError('No command specified', context);
        } else {
          throw new _Error.ImplementationError('No action for current command', context);
        }
      }
    } catch (err) {
      this.printUsage(err);
      context = null;
    }

    if (context) {
      return context.execute().then(result => {
        if (this._resultHandler) {
          return this._resultHandler(result);
        }

        return result;
      }).catch(err => {
        if (this._errorHandler) {
          return this._errorHandler(err);
        }

        this.logger.error(err);
        process.exitCode = 1;
        return err;
      });
    }

    return null;
  }

  // Concrete options

  addVersion(version, { name, alias, description } = {}) {
    this.addOption(new _Boolean2.default({
      name: name || 'version',
      alias: alias || 'v',
      description: description || 'Print version',
      run: () => this.logger.info(version)
    }));
  }

  addHelp({ name, alias, description } = {}) {
    this.addOption(new _Boolean2.default({
      name: name || 'help',
      alias: alias || 'h',
      description: description || 'Show help',
      run: context => this.logger.info(`${context.getUsage()}\n`)
    }));
  }

}

exports.default = Expose;