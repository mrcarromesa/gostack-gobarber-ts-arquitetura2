import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../../infra/typeorm/schemas/Notification';

// O Decoration @EntityRepository passamos o model como parametro
// O Repository<> recebe o model feito com o typeorm

class NotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, { id: new ObjectID(), content, recipient_id });
    this.notifications.push(notification);
    return notification;
  }
}

export default NotificationsRepository;
