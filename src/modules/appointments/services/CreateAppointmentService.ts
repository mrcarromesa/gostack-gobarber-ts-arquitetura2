import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointments = await appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointments) {
      throw new AppError('This appointment is already booked');
    }

    // Aqui ele apenas irá criar uma instancia na base de dados, para salvar o registro precisamos realizar algo a mais...
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // para salvar o registro acima na base de dados utilizamos o comando:

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
