export enum ResponseMessageEnum {

    // commons
    SUCCESS = 'success',
    INTERNAL_SERVER_ERROR = 'internal server error',
    
    // auth
    AUTH_INVALID_TOKEN = 'invalid token',
    AUTH_UNDEFINED_TOKEN = 'undefined  token',
    AUTH_USER_NOT_FOUND = 'user not found',
    AUTH_INVALID_CREDENTIALS = 'email not registered or wrong password',
    AUTH_INVALID_PIN = 'pin is invalid'

}