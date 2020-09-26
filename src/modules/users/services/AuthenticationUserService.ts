import { compare } from 'bcryptjs';

import { sign } from 'jsonwebtoken';

import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticationUserService {

  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordVerify = user.password ?? '';

    const passwordMatched = await compare(password, passwordVerify);

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
