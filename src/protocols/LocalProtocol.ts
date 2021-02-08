import { BodyParams, Req } from "@tsed/common";
import { Constant, Inject } from "@tsed/di";
import { Unauthorized } from "@tsed/exceptions";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { IStrategyOptions, Strategy } from "passport-local";
import { Credentials, User } from "../models/User";
import { UserService } from "../services/UserService";
import * as jwt from "jsonwebtoken"
import { StrategyOptions } from "passport-jwt";
import { ResponseMessageEnum } from "../enums/ResponseMessageEnum";

@Protocol<IStrategyOptions>({
    name: 'local',
    useStrategy: Strategy,
    settings: {
        usernameField: 'email',
        passwordField: 'password',
    }
})
export class LocalProtocol implements OnVerify, OnInstall {
  @Inject()
  userService: UserService

  @Constant("passport.protocols.jwt.settings")
  jwtSettings: any

  async $onVerify(
    @Req() request: Req, 
    @BodyParams() credentials: Credentials 
  ) {
      const {email, password} = credentials
      const user = await this.userService.findByEmail(email)

      if (!user) {
        throw new Unauthorized(ResponseMessageEnum.AUTH_INVALID_CREDENTIALS);
      }
  
      if (!user.verifyPassword(password)) {
        throw new Unauthorized(ResponseMessageEnum.AUTH_INVALID_CREDENTIALS);
      }
  
      const token = this.createJwt(user);
  
      return {user, token} as any
  }
    
  createJwt(user: User) {
      const {issuer, audience, secretOrKey, maxAge = 3600} = this.jwtSettings;
      const now = Date.now();
  
      return jwt.sign(
        {
          iss: issuer,
          aud: audience,
          sub: user.email,
          exp: now + maxAge * 1000,
          iat: now
        },
        secretOrKey
      );
  }

  $onInstall(strategy: Strategy): void {}
}