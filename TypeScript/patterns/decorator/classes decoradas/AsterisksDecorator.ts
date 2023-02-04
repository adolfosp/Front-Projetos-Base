import ILogger from "../ILogger";
import LoggerDecorator from "../LoggerDecorator";

export default class AsterisksDecorator extends LoggerDecorator {
  constructor(logger: ILogger) {
    super(logger);
    console.log("passei no AsterisksDecorator | metodo constructor");

  }

  log(msg: string): void {
    console.log("passei no AsterisksDecorator | metodo log");

    let outputText = `****** ${msg} ******`;
    this.logger.log(outputText);
  }
}
