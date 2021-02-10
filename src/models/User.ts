import { Model, ObjectID, PreHook, Ref, Schema, Unique } from "@tsed/mongoose"
import {AdditionalProperties, CollectionOf, DateFormat, Default, Description, Enum, Example, Format, Groups, Ignore, MinLength, Optional, Required} from "@tsed/schema"
import { GenderEnum } from "../Enums/GenderEnum";
import * as bcrypt from 'bcrypt'
import { RolesEnum } from "../enums/RolesEnum";

export class Credentials {
  @Required()
  @MinLength(6)
  @Example('password')
  @Groups('!update')
  password: string;

  @Format("email")
  @Unique()
  @Required()
  @Example('example@email.com')
  email: string;
}

export const hasingCredentials = async (user: User, next: any) => {
  if(user.password) {
    const saltPassword = await bcrypt.genSalt(10)
    user.password = bcrypt.hashSync(user.password, saltPassword)
  }

  if (user.credentialsPin) {
    const saltPin = await bcrypt.genSalt(10)
    user.credentialsPin = bcrypt.hashSync(user.credentialsPin, saltPin)
  }
}

@Model({
  schemaOptions: {
    timestamps: true
  }
})
@PreHook('save', hasingCredentials)
@PreHook('updateOne', hasingCredentials)
@PreHook('update', hasingCredentials)
@PreHook('findOneAndUpdate', hasingCredentials)
export class User extends Credentials {

  @Groups('!update', '!new')
  @ObjectID('id')
  _id: string

  @Default(false)
  @Groups('!update', '!new')
  isVerifiedEmail: boolean

  @Ignore()
  credentialsPin: string

  @Default(RolesEnum.DEFAULT)
  @Groups('!update', '!new')
  @Ignore()
  role: string

  @Required()
  @MinLength(4)
  @Example('John Gitar')
  full_name: string

  @Required()
  @DateFormat()
  @Example('2021-01-31')
  @Description('use date format: yyyy-mm-dd')
  dod: Date

  @Required()
  @Enum(GenderEnum.MALE, GenderEnum.FEMALE)
  @Example('Laki-laki')
  gender: string

  @Optional()
  @Example('087123123')
  @Description('Nomor Telepone')
  phone_number: string

  verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }

  verifyCredentialsPin(pin: string) {
    return bcrypt.compareSync(pin, this.credentialsPin)
  }
}

export class AuthUser extends User {
  _id: string
  email: string
  password: string
}

export interface IAuthUserPayload {
  user: User,
  token: string
}
