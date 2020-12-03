import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from './models/IMailProvider';
import EherealMailProvider from './implementations/EherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
