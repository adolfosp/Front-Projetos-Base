import ILogger from "../ILogger";
import LoggerDecorator from "../LoggerDecorator";

export default class LowerCaseDecorator extends LoggerDecorator {
  constructor(logger: ILogger) {
    super(logger);
    console.log("passei no loweCase | metodo constructor");

  }

  log(msg: string): void {
    console.log("passei no loweCase | metodo log");
    let outputText = msg.toLowerCase();
    this.logger.log(outputText);
  }
}
