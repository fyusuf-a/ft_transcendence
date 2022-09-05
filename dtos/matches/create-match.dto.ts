import { PickType } from '@nestjs/swagger';
import { MatchDto } from './match.dto';

export class CreateMatchDto extends PickType(MatchDto, ['homeId', 'awayId']) {}
