import { uuid } from 'uuidv4';

import IUserTokensRepository from '../IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

// O Decoration @EntityRepository passamos o model como parametro
// O Repository<> recebe o model feito com o typeorm

class FakeUserTokensRepository implements IUserTokensRepository {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(findToken =>  findToken.token === token);

    return userToken;
  }

  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();
    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);
    return userToken;
  }
}

export default FakeUserTokensRepository;
