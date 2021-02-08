import {ResponseFilter, Context, ResponseFilterMethods} from "@tsed/common";
import {any, CollectionOf, Generics, number, Property, string} from "@tsed/schema";

@Generics("T")
export class ResponsePayload<T> {
  @CollectionOf("T")
  data?: T;

  @Property()
  message: string;

  @Property()
  status: number;

  @Property()
  meta?: any;

  constructor(options: Partial<ResponsePayload<T>>) {
    options.data && (this.data = options.data);
    this.message = options.message || 'success';
    this.status = options.status || 200;
  }
}

@ResponseFilter("application/json")
export class WrapperResponseFilter implements ResponseFilterMethods {
    transform( responsePayload: ResponsePayload<any>, ctx: Context) {
        return responsePayload;
    }
}