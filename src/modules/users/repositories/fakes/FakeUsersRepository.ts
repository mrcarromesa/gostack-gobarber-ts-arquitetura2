import { uuid } from 'uuidv4';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import { IFindAllProvidersDTO } from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../../infra/typeorm/entities/User';

// O Decoration @EntityRepository passamos o model como parametro
// O Repository<> recebe o model feito com o typeorm

class FakeUsersRepository implements IUsersRepository {
  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  private users: User[] = [];

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, userData);
    this.users.push(user);
    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);
    return findUser;
  }

  public async save(data: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === data.id);

    this.users[findIndex] = data;

    return data;
  }

  public async findByDate(date: Date): Promise<User | undefined> {
    if (date) {
      return undefined;
    }
    return undefined;
  }
}

export default FakeUsersRepository;
