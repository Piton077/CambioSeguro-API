import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NotificationMailService } from 'src/domain/ports/integrations/mailer/mailer.service';

@Injectable()
export class NodeMailerService implements NotificationMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Exchange Currency JL S.A',
      template: 'welcome-email',
      context: {
        year: new Date().getFullYear(),
      },
    });
  }
}
