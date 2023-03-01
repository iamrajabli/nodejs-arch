import {App} from "./index";
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./user/user.controller";
import {ExeptionFilter} from "./errors/exeption.filter";
import {Container, ContainerModule, interfaces} from "inversify";
import {ILogger} from "./logger/logger.interface";
import {TYPES} from "./types";
import {IExeptionFilter} from "./errors/exeption.filter.interface";
import {IUserController} from "./user/user.controller.interface";
import {UserService} from "./user/user.service";
import {IUserService} from "./user/user.service.interface";

export interface IBootstrapReturn {
    appContainer: Container,
    app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    bind<IUserController>(TYPES.IUserController).to(UserController);
    bind<IUserService>(TYPES.IUserService).to(UserService);
    bind<App>(TYPES.Application).to(App);
})

function bootstrap(): IBootstrapReturn {
    const appContainer = new Container();
    appContainer.load(appBindings)
    const app = appContainer.get<App>(TYPES.Application);
    app.init().then(r => r);

    return {app, appContainer}
}


export const {app, appContainer} = bootstrap()