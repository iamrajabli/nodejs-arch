"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const base_controller_1 = require("../common/base.controller");
const http_error_class_1 = require("../errors/http-error.class");
class UserController extends base_controller_1.BaseController {
    constructor(logger) {
        super(logger);
        this.bindRoutes([
            { path: "/register", func: this.register, method: "post" },
            { path: "/login", func: this.login, method: "post" },
        ]);
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ok(res, "register");
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            next(new http_error_class_1.HTTPError(401, "Login error", "Login or password is wrong!"));
        });
    }
}
exports.UserController = UserController;
