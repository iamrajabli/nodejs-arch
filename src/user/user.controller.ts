import {BaseController} from "../common/base.controller";
import {NextFunction, Request, Response} from "express";
import {HTTPError} from "../errors/http-error.class";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import "reflect-metadata";
import {IUserController} from "./user.controller.interface";
import {UserLoginDto} from "./dto/user-login.dto";
import {UserRegisterDto} from "./dto/user-register.dto";
import {IUserService} from "./user.service.interface";
import {ValidateMiddleware} from "../common/validate.middleware";

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.IUserService) private userService: IUserService
    ) {
        super(loggerService)

        this.bindRoutes(
            [
                {path: "/register", func: this.register, method: "post", middlewares: [new ValidateMiddleware(UserRegisterDto)]},
                {path: "/login", func: this.login, method: "post"},
            ]
        )
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
        next(new HTTPError(401, "Login error", "Login or password is wrong!"))
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(body)
        if (!result) {
            return next(new HTTPError(422, 'This user already have in system!'))
        }

        this.ok(res, result)
    }

}
