// Para trabalhar especificamente com o mongo utilizamos essas dependencias
import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../schemas/Notification';

// O Decoration @EntityRepository passamos o model como parametro
// O Repository<> recebe o model feito com o typeorm

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // Como estamos utilizando mais de uma conexão precisamos passar como segundo paramentro o nome da conexão quando ela não for a default
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });
    await this.ormRepository.save(notification);
    return notification;
  }
}

export default NotificationsRepository;
