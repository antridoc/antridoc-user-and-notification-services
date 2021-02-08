import { Controller, Get, Inject } from "@tsed/common";
import { Description, Name } from "@tsed/schema";
import { AllowRoles } from "../../decorators/AllowRoles";
import { LocalAuth } from "../../decorators/LocalAuth";
import { RolesEnum } from "../../enums/RolesEnum";
import { PatientService } from "../../services/PatientService";
import { ResponsePayload } from "../../utils/WrapperResponseFilter";

@Controller(':user_id/patients')
@Name('User\'s Patients')
@LocalAuth()
@AllowRoles([ RolesEnum.ADMIN, RolesEnum.SUPER_ADMIN ])
export class PatientsController {
    // @Inject()
    // private patientService: PatientService

    // @Get('/')
    // async index(): Promise<ResponsePayload<any>> {
    //     const patients = await this.patientService.Patient.find().exec()
    //     return new ResponsePayload({data: patients })
    // }
}