import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly log = new Logger(MailService.name);
  private readonly transporter: any;

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');

    if (host) {
      const port = Number(config.get('SMTP_PORT') || 587);

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: config.get('SMTP_USER')
          ? {
              user: config.get('SMTP_USER'),
              pass: config.get('SMTP_PASSWORD'),
            }
          : undefined,
      });
    }
  }

  async send(to: string, subject: string, text: string): Promise<boolean> {
    try {
      const brevoApiKey = this.config.get<string>('BREVO_API_KEY');

      if (brevoApiKey) {
        return await this.sendViaBrevo(brevoApiKey, to, subject, text);
      }

      if (this.transporter) {
        await this.transporter.sendMail({
          from: this.config.get('SMTP_FROM') || 'arbitragem@fpvela.pt',
          to,
          subject,
          text,
        });
        return true;
      }

      this.log.warn(
        `E-mail nao configurado; mensagem nao enviada para ${to}: ${subject}`,
      );
      return false;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'erro desconhecido';

      this.log.error(
        `Falha no envio de e-mail para ${to}: ${subject} - ${message}`,
      );
      return false;
    }
  }

  private async sendViaBrevo(
    apiKey: string,
    to: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    const senderEmail =
      this.config.get<string>('BREVO_FROM_EMAIL') ||
      this.config.get<string>('SMTP_FROM') ||
      'arbitragem@fpvela.pt';

    const senderName =
      this.config.get<string>('BREVO_FROM_NAME') || 'FPV Arbitragem';

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const details = (await response.text()).slice(0, 300);
      throw new Error(
        `Brevo HTTP ${response.status}${details ? `: ${details}` : ''}`,
      );
    }

    return true;
  }
}
