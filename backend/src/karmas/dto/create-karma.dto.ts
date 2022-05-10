import { PickType } from "@nestjs/swagger";
import { KarmaDto } from "./karma.dto";

export class CreateKarmaDto extends PickType(KarmaDto, [
  'channelId',
  'userId',
  'type',
  'start',
  'end',
]) {

}
