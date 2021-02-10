import { BodyParams, Context, Controller, Get, HeaderParams, Inject, Injectable, Next, Post, Put, QueryParams, Req, Res } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";
import { Authenticate, Authorize } from "@tsed/passport";
import { CustomKey, email, Example, Format, Groups, MinLength, Name, Required, Returns, Schema, Security, Summary } from "@tsed/schema";
import EnvConfig from "../config/EnvConfig";
import { LocalAuth } from "../decorators/LocalAuth";
import { Credentials, IAuthUserPayload, User } from "../models/User";
import { strategyOptions } from "../protocols/JwtProtocol";
import { LocalProtocol } from "../protocols/LocalProtocol";
import { PatientService } from "../services/PatientService";
import { UserService } from "../services/UserService";
import { EmailSender } from "../utils/emailSender";
import { ResponsePayload } from "../utils/WrapperResponseFilter";

@Controller("/auth")
@Name('Auth')
export class AuthController {

    @Inject()
    private userService: UserService

    @Inject()
    private patientService: PatientService

    @Inject()
    private emailSender: EmailSender

    @Post("/login")
    @Summary('Login')
    @Authenticate("local")
    login(
        @Req() req: Req, 
        @Required() @BodyParams() model: Credentials, 
        @Res() res: Res,
    ): ResponsePayload<Express.User> {
       return new ResponsePayload({data: req.user})
    }

    @Post('/signup')
    @Summary('Sign Up')
    async register(
        @Req() req: Req, 
        @Required() @BodyParams() @Groups('new') payload: User, 
        @Res() res: Res
    ): Promise<ResponsePayload<IAuthUserPayload>> {
        const {email, full_name} = payload

        if ( await this.userService.isUniqueEmail(email) ) 
            throw new BadRequest('email already used',null)

        const user = await this.userService.create(payload)
        const emailVerificationLink = this.userService.generateEmailVerificationLink(user, EnvConfig.BASE_URL + '/api/auth/verify-email')

        await this.emailSender.welcomeEmail({name: full_name, email});
        await this.emailSender.verifyEmail({name: full_name, email}, emailVerificationLink);

        const proctocol = (new LocalProtocol)
        proctocol.jwtSettings = strategyOptions.settings
        const token = proctocol.createJwt(user)
        
        await this.patientService.createFromUser(user)

        return new ResponsePayload({data: { user,  token} })
    }

    @Get('/verify-email')
    @Summary('Verify Email')
    async verifyEmail(@QueryParams('token') @Required() token: string, @Res() res: Res) {
       await this.userService.verifyEmailToken(token)
       return res.redirect(EnvConfig.WEB_HOOK_VERIFY_EMAIL)
    }

    @Get('/resend-verify-email')
    @Summary('Resend Email Verification')
    @LocalAuth()
    async resendVerifyEmail( 
        @Req() req: Req, 
        @Res() res: Res
    ): Promise<ResponsePayload<any>> {
        const user = req.user as User
        const emailVerificationLink = this.userService.generateEmailVerificationLink(user, EnvConfig.BASE_URL + '/api/auth/verify-email')
        
        await this.emailSender.verifyEmail({name: user.full_name, email: user.email}, emailVerificationLink)
        return new ResponsePayload({data: null})
    }

    @Get("/profile")
    @Summary('Get Profile')
    @LocalAuth()
    getUserProfile(
        @Req() req: Req
    ): ResponsePayload<Express.User> {
        return new ResponsePayload({data: req.user})
    }

    @Put("/profile")
    @Summary('Update Profile')
    @LocalAuth()
    async updateUserProfile(
        @Req() req: Req,
        @Required() @BodyParams() @Groups('update') payload: User, 
        @Res() res: Res
    ): Promise<ResponsePayload<User>> {
        const updateUser = await this.userService.User.findOneAndUpdate({email: payload.email}, payload).exec()
        if(!updateUser) throw new BadRequest('Something wrong when updating data!',null)
        const foundedUser = await this.userService.findByEmail(payload.email)
        return new ResponsePayload({data: foundedUser})
    }
}