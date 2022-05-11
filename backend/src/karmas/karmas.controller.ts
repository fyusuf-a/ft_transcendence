import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { KarmasService } from './karmas.service';
import { CreateKarmaDto } from './dto/create-karma.dto';
import { UpdateKarmaDto } from './dto/update-karma.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseKarmaDto } from './dto/response-karma.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';

@ApiTags('karmas')
@Controller('karmas')
export class KarmasController {
  constructor(private readonly karmasService: KarmasService) {}

  @Post()
  create(@Body() createKarmaDto: CreateKarmaDto): Promise<ResponseKarmaDto> {
    try {
      return this.karmasService.create(createKarmaDto);
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get()
  findAll() {
    return this.karmasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.karmasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKarmaDto: UpdateKarmaDto) {
    return this.karmasService.update(+id, updateKarmaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.karmasService.remove(+id);
  }
}
