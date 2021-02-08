import { BodyParams, Controller, Get, Inject, Post, Req, UseBefore } from "@tsed/common";
import { deserialize } from "@tsed/json-mapper";
import { Description, email, Name, Required, Security, Summary } from "@tsed/schema";
import { LocalAuth } from "../decorators/LocalAuth";
import { Patient, PatientCreation } from "../models/Patient";
import { PatientService } from "../services/PatientService";
import { ResponsePayload } from "../utils/WrapperResponseFilter";

@Controller('/patients')
@Name('Patients')
@LocalAuth()
@Description('manage own patients data')
export class PatientsController {
    
    @Inject()
    private patientService: PatientService

    @Get('/')
    async index(
        @Req() req: Req
    ): Promise<ResponsePayload<Patient []>> {
        const patients = await this.patientService.Patient.find({user: req.user }).exec()
        const result = deserialize(patients, {type: Patient, groups: ['default']})
        return new ResponsePayload({data: result })
    }

    @Post('/')
    async store(
        @Req() req: Req,
        @BodyParams() @Required() patient: PatientCreation
    ): Promise<ResponsePayload<Patient>> {
        const newPatient = await this.patientService.create({...patient, user: req.user})
        const result = deserialize(newPatient, {type: Patient, groups: ['default']})
        return new ResponsePayload({data: result})
    }

}