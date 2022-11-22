import { createParamDecorator } from '@nestjs/common';

export const UserParam = createParamDecorator((data, req) => {
  try {
    return data ? req.user[data] : req.user;
  } catch (e) {
    throw new Error(
      'make sure that you passed "data" src/modules/user/user.param.decorator.ts',
    );
  }
});
