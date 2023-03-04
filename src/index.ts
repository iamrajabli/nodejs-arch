import express, {Express} from "express";
import {Server} from "http"
import {UserController} from "./user/user.controller";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {ILogger} from "./logger/logger.interface";

import {json} from "body-parser"

import {IConfigService} from "./config/config.service.interface";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {PrismaService} from "./database/prisma.service";

import "reflect-metadata"
import {AuthMiddleware} from "./common/auth.middleware";

@injectable()
export class App {
    port: number;
    server: Server;
    app: Express;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.IUserController) private userController: UserController,
        @inject(TYPES.IExceptionFilter) private ExceptionFilter: IExceptionFilter,
        @inject(TYPES.IConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {
        this.app = express();
        this.port = 8001;
    }

    public useMiddleware(): void {
        const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
        this.app.use(json());
    }

    public useRoutes(): void {
        this.app.use("/users", this.userController.router)
    }

    public useExceptionFilter(): void {
        this.app.use(this.ExceptionFilter.catch.bind(this))
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExceptionFilter();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log("Server started on port => " + this.port)
    }
}

