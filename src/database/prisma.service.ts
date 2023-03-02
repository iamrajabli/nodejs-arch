import {PrismaClient, UserModel} from "@prisma/client";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";

@injectable()
export class PrismaService {
    client: PrismaClient

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log('[PrismaService] successfully connected.')

        } catch (e) {
            if (e instanceof Error) {
                this.logger.log('[PrismaService] is not connected. ' + e.message)
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect()
    }
}