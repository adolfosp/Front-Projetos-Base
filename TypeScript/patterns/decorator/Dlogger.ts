import ILogger from './ILogger';

export default class DLogger implements ILogger {
  @LowerCase
  @AddAsterisks
  log(msg: string): void {
    console.log(`DLog: ${msg.toLowerCase()}`);
  }
}
