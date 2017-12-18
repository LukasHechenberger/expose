'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _yup = require('yup');

var _Option = require('../Option');

var _Option2 = _interopRequireDefault(_Option);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line

const schema = exports.schema = (0, _yup.boolean)();

class BooleanOption extends _Option2.default {

  constructor(options) {
    super(Object.assign({}, options, { schema }));
  }

  async getValue(context) {
    if (!context.currentArg) {
      throw new Error('Cannot get value without a current arg');
    }

    const currentArg = context.currentArg;

    let value;

    try {
      value = await super.getValue(context);
    } catch (e) {
      if (e instanceof _Option.MissingArgumentError) {
        value = true;
      } else if (e instanceof _Option.InvalidArgumentError && !currentArg.value) {
        value = true;
      } else {
        throw e;
      }
    }

    if (currentArg.isNegated) {
      if (Array.isArray(value)) {
        return value.map(v => !v);
      }

      return !value;
    }

    return currentArg.isNegated ? !value : value;
  }

}
exports.default = BooleanOption;