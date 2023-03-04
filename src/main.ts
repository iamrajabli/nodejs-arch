import {App} from "./index";
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./user/user.controller";
import {ExceptionFilter} from "./errors/exception.filter";
import {Container, ContainerModule, interfaces} from "inversify";
import {ILogger} from "./logger/logger.interface";
import {TYPES} from "./types";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {IUserController} from "./user/user.controller.interface";
import {UserService} from "./user/user.service";
import {IUserService} from "./user/user.service.interface";
import {ConfigService} from "./config/config.service";
import {IConfigService} from "./config/config.service.interface";
import {PrismaService} from "./database/prisma.service";
import {IUserRepository} from "./user/user.repository.interface";
import {UserRepository} from "./user/user.repository";

export interface IBootstrapReturn {
    appContainer: Container,
    app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
    bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
    bind<IUserController>(TYPES.IUserController).to(UserController);
    bind<IUserService>(TYPES.IUserService).to(UserService);
    bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
    bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
    bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
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