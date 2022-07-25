export class ChannelDto {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class CreateChannelDto {
  name: string;
  type: string;
  password?: string;

  constructor(name: string, type: string, password?: string) {
    this.name = name;
    this.type = type;
    this.password = password;
  }
}
