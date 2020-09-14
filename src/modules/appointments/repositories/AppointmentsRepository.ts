import { EntityRepository, Repository } from 'typeorm';

import Appointment from '../infra/typeorm/entities/Appointment';

// O Decoration @EntityRepository passamos o model como parametro
// O Repository<> recebe o model feito com o typeorm
@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    console.log(date);
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;
