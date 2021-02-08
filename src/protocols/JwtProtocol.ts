import { $log, Req } from "@tsed/common";
import { Inject } from "@tsed/di";
import { Unauthorized } from "@tsed/exceptions";
import { Arg, OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import EnvConfig from "../config/EnvConfig";
import { ResponseMessageEnum } from "../enums/ResponseMessageEnum";
import { UserService } from "../services/UserService";

export const strategyOptions = {
  name: 'jwt',
  useStrategy: Strategy,
  settings: {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: EnvConfig.JWT_SECRET,
      issuer: EnvConfig.DOMAIN,
      audience: EnvConfig.DOMAIN
  }
} as any

@Protocol<StrategyOptions>(strategyOptions)

export class JwtProtocol implements OnVerify, OnInstall {
    @Inject()
    usersService: UserService;
  
    async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
      const user = await this.usersService.findByEmail(jwtPayload.sub);
  
      if (!user) {
        throw new Unauthorized(ResponseMessageEnum.AUTH_INVALID_TOKEN);
      }
  
      req.user = user;
  
      return user;
    }

    $onInstall(strategy: Strategy): void {}
  }