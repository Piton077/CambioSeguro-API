import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { NodeMailerService } from '../nodemailer.service';


describe('NodeMailerService ', () => {
    let service: NodeMailerService;
    let mailerService: MailerService
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{
                provide: MailerService,
                useValue: {
                    sendMail: jest.fn(() => { })
                }
            }, NodeMailerService],
        }).compile();
        service = module.get<NodeMailerService>(NodeMailerService);
        mailerService = module.get<MailerService>(MailerService)
    });

    it('should pass welcome template to Nodemailer send', async () => {
        const email = "josemoraleswatanabe@gmail.com"
        const expected = {
            to: email,
            subject: 'Welcome to Our Exchange Currency JL S.A',
            template: 'welcome-email',
            context: {
                year: new Date().getFullYear(),
            },
        }
        mailerService.sendMail = jest.fn()
        await service.sendWelcomeEmail("josemoraleswatanabe@gmail.com")
        expect(mailerService.sendMail).toBeCalledWith(expected)
    });

});