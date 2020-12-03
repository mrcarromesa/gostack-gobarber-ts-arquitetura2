import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';

import AuthenticationUserService from '@modules/users/services/AuthenticationUserService';

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authenticationUserSerivce = container.resolve(
      AuthenticationUserService,
    );
    const { user, token } = await authenticationUserSerivce.execute({
      email,
      password,
    });

    return res.json({ user: classToClass(user), token });
  }
}

export default new SessionsController();
