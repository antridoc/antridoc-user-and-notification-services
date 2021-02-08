import {OpenSpec3, OpenSpecInfo} from '@tsed/openspec'


const specInfo: OpenSpecInfo = {
    title: 'Antridoc API',
    version: require('../package.json').version,
    description: 'Queue Hospitals System'
}

export const specOS3: Partial<OpenSpec3> = {
    info: specInfo,
    components: {
        securitySchemes: {
            bearer: {
                type: "http",
                scheme: "bearer",
                bearerFormat: ""
            }
        }
    }
}