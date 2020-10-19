import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import UserTokens from '../entities/UserToken';

// O Decoration @EntityRepository passamos o model como parametro
// O Repository<> recebe o model feito com o typeorm

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserTokens>;

  constructor() {
    this.ormRepository = getRepository(UserTokens);
  }

  public async generate(user_id: string): Promise<UserTokens> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserTokens | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }
}

export default UserTokensRepository;
