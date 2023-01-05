import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  public getNow(): Date {
    return new Date();
  }

  public getByUnixTimestamp(unixTimeStamp: number): Date {
    return new Date(unixTimeStamp);
  }
}
