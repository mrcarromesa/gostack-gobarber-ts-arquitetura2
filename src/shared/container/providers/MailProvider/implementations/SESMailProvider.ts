import { injectable, inject } from 'tsyringe';
import aws from 'aws-sdk';
import nodemailer, { Transport } from 'nodemailer';

import mailConfig from '@config/mail';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transport;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = {} as Transport;
    this.client.mailer = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_DEFAULT_REGION,
      }),
    });
    // nodemailer.createTestAccount().then(account => {
    //   const transport = nodemailer.createTransport({
    //     host: account.smtp.host,
    //     port: account.smtp.port,
    //     secure: account.smtp.secure,
    //     auth: {
    //       user: account.user,
    //       pass: account.pass,
    //     },
    //   });
    //   this.client = {} as Transport;
    //   this.client.mailer = transport;
    // });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;
    await this.client.mailer?.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
