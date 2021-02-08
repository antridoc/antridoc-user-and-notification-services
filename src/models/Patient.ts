import {Model, ObjectID, Ref, Schema} from "@tsed/mongoose";
import { DateFormat, Default, Description, Enum, Example, Format, Groups, Optional, Required } from "@tsed/schema";
import { group } from "console";
import { GenderEnum } from "../Enums/GenderEnum";
import { User } from "./User";

export class PatientCreation {
    @Default(false)
    isNeedTrusteeship: boolean

    @Optional()
    family_relationship: string

    @Required()
    @Example('John Gitar')
    full_name: string

    @Required()
    @Enum(GenderEnum.MALE, GenderEnum.FEMALE)
    @Example('Laki-laki')
    gender: string

    @Required(true, null)
    @DateFormat()
    @Example('2021-01-31')
    @Description('use date format: yyyy-mm-dd')
    dod: Date

    @Required(true, null)
    @Example('O')
    blod_type: string

    @Required(true, null)
    @Example('Jl. Kemerdekaan no. 40')
    address: string

    @Required(true, null)
    identity_type: string
    
    @Required(true, null)
    identity_number: string

    @Required(true, null)
    identity_file: string
}

@Model()
export class Patient extends PatientCreation {
    @ObjectID('id')
    @Groups('!creation')
    _id: string

   
    @Ref(User)
    @Groups('!default')
    user: User

    @Default(false)
    isMainData: boolean
}