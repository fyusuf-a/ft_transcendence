import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { UserDto } from './dto/user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Public } from 'src/auth/auth.public.decorator';
import { UsersService } from './users.service';
import { ResponseFriendshipDto } from 'src/relationships/friendships/dto/response-friendship.dto';
import { ResponseBlockDto } from 'src/relationships/blocks/dto/response-block.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { User } from './entities/user.entity';
import { Action } from 'src/casl/actions';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query() query?: QueryUserDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return await this.usersService.findAll(query, pageOptions);
  }

  @Public()
  @Post()
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request,
  ): Promise<UpdateResult> {
    const ability = this.caslAbilityFactory.createForUser(request.user);
    const dummyTarget = new User();
    dummyTarget.id = +id;
    if (ability.can(Action.Update, dummyTarget)) {
      return this.usersService.update(+id, updateUserDto);
    } else {
      throw new UnauthorizedException();
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    const user: ResponseUserDto = await this.usersService.findOne(+id);
    if (user === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.usersService.remove(+id);
  }

  @ApiBearerAuth()
  @Get('/:id/friendships')
  findFriendships(@Param('id') id: string): Promise<ResponseFriendshipDto[]> {
    return this.usersService.findFriendships(+id);
  }

  @ApiBearerAuth()
  @Get('/:id/blocks')
  findBlocks(@Param('id') id: string): Promise<ResponseBlockDto[]> {
    return this.usersService.findBlocks(+id);
  }
}
