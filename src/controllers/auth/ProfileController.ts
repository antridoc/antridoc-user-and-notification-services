import { BodyParams, Controller, Get, Inject, Put, Req, Res } from "@tsed/common"
import { BadRequest } from "@tsed/exceptions"
import { Groups, Name, Required, Summary } from "@tsed/schema"
import { LocalAuth } from "../../decorators/LocalAuth"
import { User } from "../../models/User"
import { UserService } from "../../services/UserService"
import { ResponsePayload } from "../../utils/WrapperResponseFilter"

@Controller('/profile')
@Name('Auth')
export class ProfileController {

    @Inject()
    private userService: UserService

    @Get('')
    @Summary('Get My Profile')
    @LocalAuth()
    getUserProfile(
        @Req() req: Req
    ): ResponsePayload<Express.User> {
        return new ResponsePayload({data: req.user})
    }

    @Put('')
    @Summary('Update My Profile')
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