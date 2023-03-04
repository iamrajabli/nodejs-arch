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
import {sign} from "jsonwebtoken";
import {IConfigService} from "../config/config.service.interface";
import {AuthGuard} from "../common/auth.guard";

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.IUserService) private userService: IUserService,
        @inject(TYPES.IConfigService) private configService: IConfigService,
    ) {
        super(loggerService)

        this.bindRoutes(
            [
                {
                    path: "/register",
                    func: this.register,
                    method: "post",
                    middlewares: [new ValidateMiddleware(UserRegisterDto)]
                },
                {
                    path: "/login",
                    func: this.login,
                    method: "post",
                    middlewares: [new ValidateMiddleware(UserLoginDto)]
                },
                {
                    path: "/info",
                    func: this.info,
                    method: "get",
                    middlewares: [new AuthGuard()]
                },
            ]
        )
    }

    async login({body}: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.validateUser(body);

        if (!result) {
            return next(new HTTPError(401, "Login error", "Login or password is wrong!"))
        }

        const jwt = await this.signJWT(body.email, this.configService.get("SECRET"));

        this.ok(res, {jwt})
    }

    async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
        const result = await this.userService.createUser(body)
        if (!result) {
            return next(new HTTPError(422, 'This user already have in system!'))
        }

        this.ok(res, {email: result.email, id: result.id})
    }

    async info({user}: Request, res: Response, next: NextFunction): Promise<void> {
        const userInfo = await this.userService.getUserInfo(user);
        this.ok(res, {email: userInfo?.email, id: userInfo?.id})
    }

    async signJWT(email: string, secret: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000)
                },
                secret,
                {
                    algorithm: "HS256",
                    expiresIn: "10m"
                },
                (err, token) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(token as string)
                }
            )
        })
    }

}
