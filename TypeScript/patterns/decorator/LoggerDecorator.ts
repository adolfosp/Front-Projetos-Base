import { default as ILogger, default as Logger } from "./ILogger";

export default abstract class LoggerDecorator implements ILogger{
    constructor(public logger: Logger) {}
    abstract log(msg: string): void;
}