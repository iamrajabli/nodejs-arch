import {App} from "./index";
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./user/user.controller";
import {ExeptionFilter} from "./errors/exeption.filter";

async function bootstrap() {
    const app = new App(
        new LoggerService(),
        new UserController(new LoggerService()),
        new ExeptionFilter(new LoggerService()),
    )
    await app.init();

}

bootstrap();