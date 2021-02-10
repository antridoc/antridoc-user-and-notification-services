import { Inject, Service } from "@tsed/di"
import { MongooseModel } from "@tsed/mongoose"
import { User } from "../models/User"
import * as jwt from "jsonwebtoken"
import EnvConfig from "../config/EnvConfig"
import { NotFound, Unauthorized } from "@tsed/exceptions"
import { ResponseMessageEnum } from "../enums/ResponseMessageEnum"
import { generatePinSync } from 'secure-pin'
import { use } from "passport"

@Service()
export class UserService {

    @Inject(User)
    public User: MongooseModel<User>

    $onInit() {}

    async create(user: any): Promise<User> {
        const newUser = new this.User(user)
        await newUser.validate()
        await newUser.save()
        return newUser
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.User.findOne({ email })
        if(!user) throw new NotFound(ResponseMessageEnum.AUTH_USER_NOT_FOUND)
        return user
    }

    async isUniqueEmail(email: string): Promise<boolean> {
        const user = await this.User.findOne({ email })
        if ( !user ) return false
        return true
    }

    generateEmailVerificationLink(user: User, verifyEndpoints: string): string {
        const verifyToken = jwt.sign({
            email: user.email,
            id: user._id,
            slug: 'antridoc-email-token'
        }, EnvConfig.JWT_SECRET, { expiresIn: '3 days' } )
        
        return verifyEndpoints + '?token=' + verifyToken
    }

    async verifyEmailToken(token: string): Promise<User | any> {
        const payload: any = jwt.verify(token, EnvConfig.JWT_SECRET)
        console.log('Payload', payload)
        const user = await this.User.findOne({email: payload.email})
        if (!user || payload.slug != 'antridoc-email-token') throw new NotFound(ResponseMessageEnum.AUTH_USER_NOT_FOUND)

        user.isVerifiedEmail = true
        await user.save()

        return user
    }

    async getCredentialPin(user: User): Promise<string> {
        const pin = generatePinSync(6)

        const foundedUser = await this.User.findOne({email: user.email})
        if (!foundedUser) throw new NotFound(ResponseMessageEnum.AUTH_USER_NOT_FOUND)
        
        foundedUser.credentialsPin = pin
        await foundedUser.save()
        
        return pin
    }

    async resetPassword(email: string, new_password: string, pin: string): Promise<void> {
        const user = await this.User.findOne({email})
        if (!user) throw new NotFound(ResponseMessageEnum.AUTH_USER_NOT_FOUND)
        
        if (!user.verifyCredentialsPin(pin)) throw new Unauthorized(ResponseMessageEnum.AUTH_INVALID_PIN)

        user.password = new_password
        await user.save()
    }
} 