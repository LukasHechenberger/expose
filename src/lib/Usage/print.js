import stringLength from 'string-length';

export interface Printable {
  toString(): string;
}

export default function print(lines: Printable[]) {
  return lines.map(l => l.toString()).join('\n');
}

export type Align = 'left' | 'right';

export function pad(text: string, targetLength: number, align: Align = 'left', fill: string = ' '): string {
  const originalLength = stringLength(text);
  const paddingRequired = targetLength - originalLength;
  const padding = fill.repeat(paddingRequired);

  if (align === 'left') {
    return `${text}${padding}`;
  }

  return `${padding}${text}`;
}
