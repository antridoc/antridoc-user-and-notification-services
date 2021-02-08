import { Model, ObjectID, PreHook, Ref, Schema, Unique } from "@tsed/mongoose"
import {CollectionOf, DateFormat, Default, Description, Enum, Example, Format, Ignore, MinLength, Optional, Required} from "@tsed/schema"
import { GenderEnum } from "../Enums/GenderEnum";
import * as bcrypt from 'bcrypt'
import { RolesEnum } from "../enums/RolesEnum";

export class Credentials {
  @Required()
  @MinLength(6)
  @Example('password')
  password: string;

  @Format("email")
  @Unique()
  @Required()
  @Example('example@email.com')
  email: string;
}

export class UserCreation extends Credentials {
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
}

const hasingPassword = async (user: User, next: any) => {
  if(user.password) {
    const salt = await bcrypt.genSalt(10)
    user.password = bcrypt.hashSync(user.password, salt)
  }
}

@Model({
  schemaOptions: {
    timestamps: true
  }
})
@PreHook('save', hasingPassword)
@PreHook('updateOne', hasingPassword)
@PreHook('update', hasingPassword)
@PreHook('findOneAndUpdate', hasingPassword)
export class User extends UserCreation {

  @ObjectID('id')
  _id: string

  @Ignore()
  password: string

  @Default(false)
  isVerifiedEmail: boolean

  @Default(RolesEnum.DEFAULT)
  role: string

  verifyPassword(password: string) {
    return bcrypt.compareSync(password, this.password)
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
