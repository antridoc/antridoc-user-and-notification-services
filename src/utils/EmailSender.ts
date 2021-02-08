import { MailDataRequired, MailService } from '@sendgrid/mail'
import { Injectable } from '@tsed/di'
import ejs from 'ejs'
import fs from 'fs'
import EnvConfig from '../config/EnvConfig'

export interface IEmailData {
    email: string
    name: string
}

@Injectable()
export abstract class EmailSender {
    
    public dir = __dirname

    public options: any = {
        from: {
            name: 'Antridoc',
            email: 'office@antridoc.com'
        },
        subject: 'Welcome to Antridoc',
    }

    private mailService: MailService = new MailService()
    
    constructor(){
        this.mailService.setApiKey(EnvConfig.SENDGRID_API_KEY)
    }

    private generateTemlate(template: string){
        const fileTemplate = fs.readFileSync(this.dir + '/../../views/emails/'+ template +'.ejs', 'utf-8')
        return ejs.render(fileTemplate, this.options)
    }

    private async send() {
        try {
            return await this.mailService.send(this.options)
        } catch (error) {
            if (error.response) {
                throw new Error('mail sender failed!')
            }
        }
    }

    async welcomeEmail(to: IEmailData | string) {
        this.options.subject = 'Wellcome to Antridoc'
        this.options.to = to
        this.options.html = this.generateTemlate('welcome')
        return await this.send()
    }

    async verifyEmail(to: IEmailData | string, aditionalLinks?: string) {
        this.options.subject = 'Email verify'
        this.options.to = to
        this.options.aditionalLinks = aditionalLinks
        this.options.html = this.generateTemlate('verify')
        return await this.send()
    }

    async resetPassword(to: IEmailData | string, aditionalLinks: string) {
        this.options.subject = 'Reset Password'
        this.options.to = to
        this.options.aditionalLinks = aditionalLinks
        this.options.html = this.generateTemlate('resetPassword')
        return await this.send()
    }

}