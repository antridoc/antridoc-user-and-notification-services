import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/passport";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import mongooseConfig from "./config/mongoose";
import { IndexCtrl } from "./controllers/pages/IndexCtrl";
import { AuthUser } from "./models/User";
import { JwtProtocol } from "./protocols/JwtProtocol";
import { specOS3 } from "./specOS3";
import { WrapperResponseFilter } from "./utils/WrapperResponseFilter";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: 8083,
  httpsPort: false, // CHANGE
  mount: {
    "/": [
      `${rootDir}/controllers/**/*.ts`
    ],
    "/docs": [IndexCtrl]
  },
  swagger: [
    {
      path: "/v3/docs",
      specVersion: "3.0.1",
      spec: specOS3
    }
  ],
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  mongoose: mongooseConfig,
  componentsScan: [
    `${rootDir}/services/**/*.ts`,
    `${rootDir}/protocols/**/*.ts`,
    `${rootDir}/decorators/**/*.ts`,
    `${rootDir}/middlewares/**/*.ts`,
    `${rootDir}/utils/**/*.ts`
  ],
  passport: {
    userInfoModel: AuthUser
  },
  exclude: [
    "**/*.spec.ts"
  ],
  imports: [
    JwtProtocol
  ],
  responseFilters: [WrapperResponseFilter],
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }));
  }

  $afterRoutesInit(): void {
    
  }
}
