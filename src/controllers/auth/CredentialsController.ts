import { Controller, Get, Inject, QueryParams } from "@tsed/common";
import { Email, Name, Required } from "@tsed/schema";
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

    @Get('/forgot-passord')
    async forgotPassword(
        @QueryParams('email')
        @Email()
        @Required()
        email: string
    ): Promise<ResponsePayload<any>> {
        const user = await this.userService.findByEmail(email)
        const pin = await this.userService.getCredentialPin(user)
        await this.emailSender.resetPassword({name: user.full_name, email}, pin);
        return new ResponsePayload({data: {}})
    }

}