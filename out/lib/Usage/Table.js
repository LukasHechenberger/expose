'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableLine = undefined;

var _stringLength = require('string-length');

var _stringLength2 = _interopRequireDefault(_stringLength);

var _print = require('./print');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line

class TableLine {

  constructor(table, columns) {
    this._table = table;
    this._columns = columns;
  }

  toString() {
    return `${this._table.indent}${this._columns.map((text, i) => (0, _print.pad)(text, this._table.columnWidth(i), this._table.columnAlign(i))).join(this._table.columnSpacing)}`;
  }

}

exports.TableLine = TableLine;
class Table {

  constructor({ spacing = '  ', indent = '' } = {}) {
    this._columnWidths = [];
    this._spacing = spacing;
    this._indent = indent;
    this._defaultAlign = 'left';
  }

  addLine(columns) {
    columns.forEach((col, i) => {
      if (!this._columnWidths[i]) {
        this._columnWidths.push(0);
      }

      this._columnWidths[i] = Math.max(this._columnWidths[i], (0, _stringLength2.default)(col));
    });

    return new TableLine(this, columns);
  }

  columnWidth(index) {
    return this._columnWidths[index];
  }

  setAlign(align, forColumn = -1) {
    if (forColumn < 0) {
      this._defaultAlign = align;
    } else {
      if (!this._columnAlign) {
        this._columnAlign = Array(this._columnWidths.length).fill(false);
      }
      this._columnAlign[forColumn] = align;
    }
  }

  columnAlign(index) {
    if (this._columnAlign) {
      return this._columnAlign[index];
    }

    return this._defaultAlign;
  }

  get columnSpacing() {
    return this._spacing;
  }

  get indent() {
    return this._indent;
  }

}
exports.default = Table;