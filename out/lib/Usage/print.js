'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = print;
exports.pad = pad;

var _stringLength = require('string-length');

var _stringLength2 = _interopRequireDefault(_stringLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function print(lines) {
  return lines.map(l => l.toString()).join('\n');
}
function pad(text, targetLength, align = 'left', fill = ' ') {
  const originalLength = (0, _stringLength2.default)(text);
  const paddingRequired = targetLength - originalLength;
  const padding = fill.repeat(paddingRequired);

  if (align === 'left') {
    return `${text}${padding}`;
  }

  return `${padding}${text}`;
}