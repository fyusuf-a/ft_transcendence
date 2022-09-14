import { ChannelType } from '@dtos/channels';

export class ChannelDto {
  id: number;
  name: string;
  type?: ChannelType;

  constructor(id: number, name: string, type?: ChannelType) {
    this.id = id;
    this.name = name;
    this.type = type;
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
