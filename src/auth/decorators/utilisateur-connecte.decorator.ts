import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UtilisateurConnecte = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().user;
    },
);
