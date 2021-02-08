import {Catch, PlatformContext, ExceptionFilterMethods, ResponseErrorObject} from "@tsed/common";
import {Exception} from "@tsed/exceptions";

@Catch(Error)
@Catch(Exception)
export class HttpExceptionFilter implements ExceptionFilterMethods {
    catch(exception: Exception, ctx: PlatformContext) {
        const {response, logger} = ctx;
        const error = this.mapError(exception);
        const headers = this.getHeaders(exception);
    
        logger.error({
          error
        });
    
        response
          .setHeaders(headers)
          .status(error.status)
          .body(error);
      }
    
      mapError(error: any) {
        const errors = this.getErrors(error)

        return {
          message: errors.length > 0 ? errors[0].message : error.message,
          status: error.status || 500,
          errors
        };
      }
    
      protected getErrors(error: any) {
        console.log('GET ERROR', error)
        return [error, error.origin].filter(Boolean).reduce((errs, {errors}: ResponseErrorObject) => {
          return [...errs, ...(errors || [])];
        }, []);
      }
    
      protected getHeaders(error: any) {
        return [error, error.origin].filter(Boolean).reduce((obj, {headers}: ResponseErrorObject) => {
          return {
            ...obj,
            ...(headers || {})
          };
        }, {});
      }
    }