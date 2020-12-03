import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

// Nome da tabela no mongodb
@Entity('notifications')
class Notification {
  // Coluna "Primary key"
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column('uuid')
  recipient_id: string;

  // No mongo não temos as migrations então utilizamos as props dessa forma
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}

export default Notification;
