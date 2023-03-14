import { ApiProperty } from '@nestjs/swagger';

export class VerifyJoinDTO {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  submit_task_id: string;
}
