import type { Writable } from 'stream';

declare module '@ls-age/logger' {
  declare export class Logger {
    constructor(options: { timestamp?: boolean }): Logger;

    debug(...messages: any[]): void;
    info(...messages: any[]): void;
    warn(...messages: any[]): void;
    error(...messages: any[]): void;

    pipe(stream: Writable): Logger;
  }

  declare export default Logger;
}
