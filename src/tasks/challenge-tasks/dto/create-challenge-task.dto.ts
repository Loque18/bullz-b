import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeTaskDTO {
  @ApiProperty()
  social_name: string;

  @ApiProperty()
  task_name: string;

  @ApiProperty()
  button_titles: string[];

  @ApiProperty()
  isUrl: boolean;

  @ApiProperty()
  isDescription: boolean;

  @ApiProperty()
  isTemplate: boolean;

  @ApiProperty()
  infoText: string;

  @ApiProperty()
  isFileNeeded: boolean;

  @ApiProperty()
  isUrlNeeded: boolean;

  @ApiProperty()
  isInternal: boolean;

  @ApiProperty()
  isPrivatePublic: boolean;
}
