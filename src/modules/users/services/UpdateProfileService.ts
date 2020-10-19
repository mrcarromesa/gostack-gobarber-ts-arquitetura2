import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const checkEmail = await this.userRepository.findByEmail(email);

    if (checkEmail && checkEmail.id !== user_id) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You nee to inform the old password to set a new password',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        String(user.password),
      );

      if (!checkOldPassword) {
        throw new AppError('Old password not match.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.userRepository.save(user);
  }
}

export default UpdateProfileService;
