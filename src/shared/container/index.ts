import { container } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';


// id do repositorio ou da dependencia que queremos registrar
container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository',AppointmentsRepository,);

container.registerSingleton<IUsersRepository>('UsersRepository',UsersRepository,);
