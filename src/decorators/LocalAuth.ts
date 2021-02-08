import { useDecorators } from "@tsed/core";
import { Unauthorized } from "@tsed/exceptions";
import { Authorize, AuthorizeOptions } from "@tsed/passport";
import { In, Returns, Security } from "@tsed/schema";

export function LocalAuth(options: AuthorizeOptions = {}) {
    return useDecorators(
        Authorize("jwt", options),
        Security("bearer"),
        Returns(401, Unauthorized).Description("Unauthorized"),
        In("authorization").Name("Authorization").Description("Bearer Token").Type(String).Required(true),
      );
}