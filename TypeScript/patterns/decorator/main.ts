import DLogger from "./Dlogger";

const logger = new DLogger();
// const decoratedLogger = new AsterisksDecorator(
//   new LowerCaseDecorator(logger)
// );

logger.log("Hello Decorator!");