import express, {Express} from "express";
import {Server} from "http"
import {LoggerService} from "./logger/logger.service";
import {UserController} from "./user/user.controller";
import {ExeptionFilter} from "./errors/exeption.filter";


export class App {
    port: number;
    server: Server;
    app: Express;
    exeptionFilter: ExeptionFilter

    constructor(private logger: LoggerService, private userController: UserController, exeptionFilter: ExeptionFilter) {
        this.app = express();
        this.port = 8000;
        this.exeptionFilter = exeptionFilter
    }

    public useRoutes() {
        this.app.use("/users", this.userController.router)
    }

    public useExeptionFilter() {
        this.app.use(this.exeptionFilter.catch.bind(this))
    }

    public async init() {
        this.useRoutes();
        this.useExeptionFilter();
        this.server = this.app.listen(this.port);
        this.logger.log("Server started on port => " + this.port)
    }
}

