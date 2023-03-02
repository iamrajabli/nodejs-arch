import express, {Express} from "express";
import {Server} from "http"
import {UserController} from "./user/user.controller";
import {ExeptionFilter} from "./errors/exeption.filter";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {ILogger} from "./logger/logger.interface";

import {json} from "body-parser"

import "reflect-metadata"
import {IConfigService} from "./config/config.service.interface";
import {IExeptionFilter} from "./errors/exeption.filter.interface";
import {PrismaService} from "./database/prisma.service";

@injectable()
export class App {
    port: number;
    server: Server;
    app: Express;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.IUserController) private userController: UserController,
        @inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
        @inject(TYPES.IConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {
        this.app = express();
        this.port = 8001;
    }

    public useMiddleware(): void {
        this.app.use(json())
    }

    public useRoutes(): void {
        this.app.use("/users", this.userController.router)
    }

    public useExeptionFilter(): void {
        this.app.use(this.exeptionFilter.catch.bind(this))
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilter();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log("Server started on port => " + this.port)
    }
}

