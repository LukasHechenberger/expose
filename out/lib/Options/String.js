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

const schema = exports.schema = (0, _yup.string)(); // eslint-disable-line
class StringOption extends _Option2.default {

  constructor(options) {
    super(Object.assign({}, options, { schema }));
  }

}
exports.default = StringOption;