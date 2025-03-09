import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class HttpCustomService {
  constructor(private readonly httpService: HttpService) {}

  public async apiFindAll(url) {
    try {
      const response = await firstValueFrom(this.httpService.get(url));

      return response.data;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
