import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/createMessage.dto';
import { ResponseMessageDto } from './dto/responseMessage.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll(): Promise<ResponseMessageDto[]> {
    return await this.messagesService.findAll();
  }

  @Post('create')
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  async create(@Body() createUserDto: CreateMessageDto): Promise<ResponseMessageDto> {
    return await this.messagesService.create(createUserDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findById(@Param('id') id: string): Promise<ResponseMessageDto> {
    const user: ResponseMessageDto = await this.messagesService.findById(id);
    if (user === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  async removeById(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(id);
  }
}
