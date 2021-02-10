import { Inject, Injectable, Service } from "@tsed/di";
import { MongooseModel, registerModel } from "@tsed/mongoose";
import { Patient } from "../models/Patient";
import { User } from "../models/User";

@Service()
export class PatientService {
    @Inject(Patient)
    public Patient: MongooseModel<Patient>

    $onInit() {}

    async getByUser(user: any): Promise<Patient []> {
        const patients = await this.Patient.find({user: user}).exec()
        return patients
    }

    async create(patient: any): Promise<Patient> {
        const newPatient = new this.Patient(patient)
        await newPatient.validate()
        await newPatient.save()
        return newPatient
    }

    async createFromUser(user: User): Promise<Patient> {
        const {full_name, gender, dod} = user
        const newPatient = await this.create({
            user,
            isMainData: true,
            full_name, 
            gender, 
            dod
        })
        return newPatient
    }
}