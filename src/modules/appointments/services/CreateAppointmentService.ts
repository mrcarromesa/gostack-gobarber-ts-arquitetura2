import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';


import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {

    const appointmentDate = startOfHour(date);

    const findAppointments = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointments) {
      throw new AppError('This appointment is already booked');
    }

    // Aqui ele apenas irá criar uma instancia na base de dados, para salvar o registro precisamos realizar algo a mais...
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
