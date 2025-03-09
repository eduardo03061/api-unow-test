import { Injectable } from '@nestjs/common';
import { HttpCustomService } from 'src/providers/http/http.service';

@Injectable()
export class WorkstationsService {
  constructor(private readonly httpService: HttpCustomService) {}

  async findAll() {
    const response = await this.httpService.apiFindAll(
      `https://ibillboard.com/api/positions`,
    );
    return response;
  }
}
