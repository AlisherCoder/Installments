import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EskizeService {
  private token;
  private baseUrl = 'https://notify.eskiz.uz/api';
  private email = process.env.EMAIL;
  private password = process.env.ESKIZ;
  constructor() {
    // this.auth;
  }

  async auth() {
    try {
      const { data: response } = await axios.post(`${this.baseUrl}/auth/login`, {
        email: this.email,
        password: this.password,
      });

      this.token = response?.data?.token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sendSms(message: string, phone: string) {
    try {
      await axios.post(
        `${this.baseUrl}/message/sms/send`,
        {
          mobile_phone: phone,
          message: 'Bu eskizdan test',
          from: '4546',
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );
    } catch (error) {
      // await this.auth();
      // await this.sendSms(message, phone);
      throw new BadRequestException(error.message);
    }
  }
}
