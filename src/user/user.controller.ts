import {BaseController} from "../common/base.controller";
import {LoggerService} from "../logger/logger.service";
import {NextFunction, Request, Response} from "express";
import {HTTPError} from "../errors/http-error.class";

export class UserController extends BaseController {
    constructor(logger: LoggerService) {
        super(logger)

        this.bindRoutes(
            [
                {path: "/register", func: this.register, method: "post"},
                {path: "/login", func: this.login, method: "post"},
            ]
        )
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        return this.ok(res, "register")
    }

    public async login(req: Request, res: Response, next: NextFunction) {
        next(new HTTPError(401, "Login error", "Login or password is wrong!"))
    }
}