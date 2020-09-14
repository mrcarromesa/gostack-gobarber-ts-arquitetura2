import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticationUserService {
  async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign(
      // Payload dentro desse objeto, ou seja informações do usuário que queremos recuperar, não pode ser uma informação sensivel
      {},
      secret,
      // configurações do jwt
      {
        subject: user.id, // Referenciar sempre a informação unica do usuário, para depois sabermos qual usuário gerou esse token
        expiresIn, // Quanto tempo esse token irá durar nunca colocar para sempre é perigoso
      },
    );

    delete user.password;

    return {
      user,
      token,
    };
  }
}

export default AuthenticationUserService;
