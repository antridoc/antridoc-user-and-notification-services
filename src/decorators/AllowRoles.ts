import { Use, UseAfter, UseBeforeEach } from "@tsed/common";
import { StoreSet, useDecorators } from "@tsed/core";
import { RolesEnum } from "../enums/RolesEnum";
import { UserRoleMiddleware } from "../middlewares/UserRoleMiddleware";

export function AllowRoles(roles?: RolesEnum []) {
    return useDecorators(
        StoreSet(UserRoleMiddleware, { alloweddRoles: roles }),
        UseBeforeEach(UserRoleMiddleware)
    )
}