import {UserRegisterDto} from "./dto/user-register.dto";
import {User} from "./user.entity";
import {UserLoginDto} from "./dto/user-login.dto";

export interface IUserService {
    createUser: (dto: UserRegisterDto) => Promise<User | null>;
    validateUser: (data: UserLoginDto) => Promise<boolean>;
}