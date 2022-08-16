export class Herror {
  status: number;
  message: string;
  extra?: any;
  constructor(message: string, status: number, extra?: any) {
    this.status = status;
    this.message = message;
    this.extra = extra;
  }
}
