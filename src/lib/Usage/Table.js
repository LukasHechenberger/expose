import stringLength from 'string-length';
import { pad } from './print';
import type { Printable, Align } from './print'; // eslint-disable-line

export class TableLine implements Printable {

  _table: Table
  _columns: string[]

  constructor(table: Table, columns: string[]) {
    this._table = table;
    this._columns = columns;
  }

  toString(): string {
    return `${this._table.indent}${
      this._columns
        .map((text, i) => pad(text, this._table.columnWidth(i), this._table.columnAlign(i)))
        .join(this._table.columnSpacing)
    }`;
  }

}

export default class Table {

  _columnWidths: number[]
  _defaultAlign: Align
  _columnAlign: ?Align[]
  _spacing: string
  _indent: string

  constructor({ spacing = '  ', indent = '' } : { spacing?: string, indent?: string } = {}) {
    this._columnWidths = [];
    this._spacing = spacing;
    this._indent = indent;
    this._defaultAlign = 'left';
  }

  addLine(columns: string[]): TableLine {
    columns.forEach((col, i) => {
      if (!this._columnWidths[i]) { this._columnWidths.push(0); }

      this._columnWidths[i] = Math.max(this._columnWidths[i], stringLength(col));
    });

    return new TableLine(this, columns);
  }

  columnWidth(index: number): number {
    return this._columnWidths[index];
  }

  setAlign(align: Align, forColumn: number = -1) {
    if (forColumn < 0) {
      this._defaultAlign = align;
    } else {
      if (!this._columnAlign) {
        this._columnAlign = Array(this._columnWidths.length).fill(false);
      }
      this._columnAlign[forColumn] = align;
    }
  }

  columnAlign(index: number): Align {
    if (this._columnAlign) {
      return this._columnAlign[index];
    }

    return this._defaultAlign;
  }

  get columnSpacing(): string {
    return this._spacing;
  }

  get indent(): string {
    return this._indent;
  }

}
