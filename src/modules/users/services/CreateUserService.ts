import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

injectable()
class CreateUserService {

  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository) {}

  async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address alredy used');
    }

    const hashPassword = await hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    delete user.password;

    return user;
  }
}

export default CreateUserService;
