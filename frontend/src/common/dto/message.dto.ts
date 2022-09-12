export class MessageDto {
  id: number;
  senderId: number;
  channelId: number;
  content: string;
  createdAt: string;

  constructor(
    id: number,
    content: string,
    senderId: number,
    channelId: number,
    createdAt: string,
  ) {
    this.id = id;
    this.content = content;
    this.senderId = senderId;
    this.channelId = channelId;
    this.createdAt = createdAt;
  }
}
