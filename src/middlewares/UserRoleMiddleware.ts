import { EndpointInfo, IMiddleware, Middleware, Req } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { ResponseMessageEnum } from "../enums/ResponseMessageEnum";

@Middleware()
export class UserRoleMiddleware implements IMiddleware {
    use(@Req() req: Req, @EndpointInfo() endpoint: EndpointInfo) {
        const options = endpoint.get(UserRoleMiddleware) || {}

        if (options.alloweddRoles) {
            if(!req.user) throw new Unauthorized(ResponseMessageEnum.AUTH_INVALID_TOKEN);
            const { role } = req.user as any
            
            if (!options.alloweddRoles.includes(role))
                throw new  Forbidden('user not allowed')
        }
    }
}