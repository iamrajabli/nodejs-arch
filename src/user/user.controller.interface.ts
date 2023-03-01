import {NextFunction, Request, Response} from "express";

export interface IUserController {
    register: (req: Request, res: Response, next: NextFunction) => void

    login: (req: Request, res: Response, next: NextFunction) => void
}

export type ExpressReturnType = Response<any, Record<string, any>>