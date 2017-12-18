'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.secondary = exports.info = exports.name = exports.desc = exports.section = exports.header = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _chalk2.default;
const header = exports.header = _chalk2.default.magenta;
const section = exports.section = _chalk2.default.bold;
const desc = exports.desc = _chalk2.default.reset;
const name = exports.name = _chalk2.default.cyan;
const info = exports.info = _chalk2.default.yellow;
const secondary = exports.secondary = _chalk2.default.dim;