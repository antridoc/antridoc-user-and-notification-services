import { BodyParams, Controller, Get, Inject, Post, QueryParams } from "@tsed/common";
import { Email, Example, Name, Property, Required } from "@tsed/schema";
import { UserService } from "../../services/UserService";
import { EmailSender } from "../../utils/EmailSender";
import { ResponsePayload } from "../../utils/WrapperResponseFilter";

@Controller('/credentials')
@Name('Auth')
export class CredentialsController {

    @Inject()
    private userService: UserService

    @Inject()
    private emailSender: EmailSender

    @Get('/forgot-password')
    async forgotPassword(
        @QueryParams('email') @Email() @Required() email: string
    ): Promise<ResponsePayload<any>> {
        const user = await this.userService.findByEmail(email)
        const pin = await this.userService.getCredentialPin(user)
        await this.emailSender.resetPassword({name: user.full_name, email}, pin);
        return new ResponsePayload({data: {}})
    }

    @Post('/reset-password')
    async resetPassword(
        @BodyParams('email') @Required() @Email() email: string,
        @BodyParams('new_password') @Required() @Example('password') new_password: string,   
        @BodyParams('pin') @Required() @Example('132453') pin: string  
    ): Promise<ResponsePayload<any>> {
        await this.userService.resetPassword(email, new_password, pin)
        return new ResponsePayload({data: {}})
    }

}