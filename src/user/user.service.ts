import {IUserService} from "./user.service.interface";
import {UserRegisterDto} from "./dto/user-register.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {inject, injectable} from "inversify";

import {User} from "./user.entity";
import "reflect-metadata";
import {TYPES} from "../types";
import {IConfigService} from "../config/config.service.interface";
import {IUserRepository} from "./user.repository.interface";
import {UserModel} from "@prisma/client";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.IConfigService) private configService: IConfigService,
        @inject(TYPES.IUserRepository) private userRepository: IUserRepository
    ) {
    }

    async createUser({password, name, email}: UserRegisterDto): Promise<UserModel | null> {

        const newUser = new User(email, name);
        const salt = this.configService.get("SALT")

        await newUser.setPassword(password, +salt);

        const existedUser = await this.userRepository.find(email);
        if (existedUser) {
            return null;
        }
        return await this.userRepository.create(newUser)
    }

    async validateUser({email,password}: UserLoginDto): Promise<boolean> {
        const existedUser = await this.userRepository.find(email);

        if (!existedUser) {
            return false
        }

        const user = new User(existedUser.email, existedUser.name, existedUser.password);

        return await user.comparePassword(password);
    }

    async getUserInfo(email: string): Promise<UserModel | null> {
        return this.userRepository.find(email)
    }
}