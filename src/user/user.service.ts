import {IUserService} from "./user.service.interface";
import {UserRegisterDto} from "./dto/user-register.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {injectable} from "inversify";

import {User} from "./user.entity";
import "reflect-metadata";

@injectable()
export class UserService implements IUserService {
    async createUser({password, name, email}: UserRegisterDto): Promise<User | null> {

        const newUser = new User(email, name);
        await newUser.setPassword(password)
        return newUser

    }

    async validateUser({}: UserLoginDto): Promise<boolean> {
        return true
    }
}