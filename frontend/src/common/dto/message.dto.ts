export class MessageDto {
  id: number;
  senderId: number;
  channelId: number;
  content: string;
  createdAt: Date;

  constructor(
    id: number,
    content: string,
    senderId: number,
    channelId: number,
    createdAt: Date
  ) {
    this.id = id;
    this.content = content;
    this.senderId = senderId;
    this.channelId = channelId;
    this.createdAt = createdAt;
  }
}
