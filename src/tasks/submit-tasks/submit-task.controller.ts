import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SubmitTaskService } from './submit-task.service';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { SubmitTask } from './submit-task.entity';
import { CreateSubmitTaskDTO } from './dto/create-submit-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateResult } from 'typeorm';
import { UpdateSubmitTaskDTO } from './dto/update-submit-task.dto';
@Controller('submit-tasks')
export class SubmitTaskController {
  constructor(private submitTaskService: SubmitTaskService) {}

  @ApiResponse({
    status: 200,
    type: SubmitTask,
    isArray: true,
    description: 'list tasks',
  })
  @Get('/get-submits-by-user/:user/challenge/:challenge')
  async getTasks(@Param('user') user, @Param('challenge') challenge) {
    const tasks = await this.submitTaskService.getSubmitTasks(challenge, user);
    return tasks;
  }

  @ApiBody({
    description: 'Create SubmitTask',
    type: CreateSubmitTaskDTO,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: SubmitTask,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addSubmitTask(@Body() createSubmitTaskDTO: CreateSubmitTaskDTO) {
    const submit = await this.submitTaskService.getSubmitTasks(
      createSubmitTaskDTO.challenge_task,
      createSubmitTaskDTO.submitted_by,
    );
    console.log('submit', submit);
    if (submit) {
      console.log('submit', submit);
      if (createSubmitTaskDTO.file_url) {
        submit.file_url = createSubmitTaskDTO.file_url;
      }

      if (createSubmitTaskDTO.external_url) {
        submit.external_url = createSubmitTaskDTO.external_url;
      }

      if (createSubmitTaskDTO.answer_text) {
        submit.answer_text = createSubmitTaskDTO.answer_text;
      }
      delete submit['createdAt'];
      delete submit['updatedAt'];
      await this.submitTaskService.update(submit);
      return this.submitTaskService.getSubmitTasks(
        createSubmitTaskDTO.challenge_task,
        createSubmitTaskDTO.submitted_by,
      );
    } else {
      return this.submitTaskService.addSubmitTask(createSubmitTaskDTO);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: UpdateResult,
  })
  async update(@Body() updateSubmitTaskDTO: UpdateSubmitTaskDTO) {
    delete updateSubmitTaskDTO['createdAt'];
    delete updateSubmitTaskDTO['updatedAt'];
    const update = await this.submitTaskService.update(updateSubmitTaskDTO);
    return update;
  }

  // @UseGuards(JwtAuthGuard)
  @Put('/update-submit')
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: UpdateResult,
  })
  async updateSubmit(@Body() updateSubmit) {
    const update = await this.submitTaskService.updateSubmit(updateSubmit);
    return update;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('/verify-twitter-follow')
  // async verifyTask(@Body() taskInfo) {
  //   const followData = await this.submitTaskService.getTwitterFollow(
  //     taskInfo.source_screen_name,
  //     taskInfo.target_screen_name,
  //   );
  //   if (followData) {
  //     if (followData?.relationship?.source?.followed_by) {
  //       //verified
  //       const obj = {
  //         id: taskInfo.id,
  //         isVerified: true,
  //       };
  //       await this.submitTaskService.update(obj);
  //       return { verified: true };
  //     } else {
  //       return { verified: false, message: 'not following' };
  //     }
  //   } else {
  //     return { verified: false, message: 'user does not exist' };
  //   }
  // }

  @ApiResponse({
    status: 200,
    type: SubmitTask,
    isArray: true,
    description: 'list tasks',
  })
  @Get('/get-submit/:id')
  async getSubmit(@Param('id') id) {
    const tasks = await this.submitTaskService.getSubmitTasksById(id);
    return tasks;
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/verify-task/:id')
  async verifyTask(@Param('id') id) {
    const task = await this.submitTaskService.getSubmitTasksById(id);
    let target_screen_name = '';
    let tweetId = '';
    switch (task.challenge_task.task_template.identifier) {
      case 'twitter_follow':
        const source_screen_name = task.challenge_task.url_text;
        target_screen_name = this.submitTaskService.getLastElement(
          task.submitted_by.twitter_url,
        );
        const followData = await this.submitTaskService.getTwitterFollow(
          source_screen_name,
          target_screen_name,
        );
        if (followData) {
          if (followData?.relationship?.source?.followed_by) {
            //verified
            const obj = {
              id: task.id,
              isVerified: true,
            };
            await this.submitTaskService.update(obj);
            return { verified: true };
          } else {
            return { verified: false, message: 'not following' };
          }
        } else {
          return { verified: false, message: 'user does not exist' };
        }
        break;
      case 'twitter_like':
        tweetId = this.submitTaskService.getLastElement(
          task.challenge_task.url_text,
        );
        target_screen_name = this.submitTaskService.getLastElement(
          task.submitted_by.twitter_url,
        );
        const likeData = await this.submitTaskService.getTwitterLike(
          target_screen_name,
          tweetId,
        );
        console.log('likeData', likeData);
        if (likeData && likeData.length && likeData[0].id_str == tweetId) {
          const obj = {
            id: task.id,
            isVerified: true,
          };
          await this.submitTaskService.update(obj);
          return { verified: true };
        } else {
          return { verified: false, message: 'not liked' };
        }
        break;
      case 'twitter_retweet':
        tweetId = this.submitTaskService.getLastElement(
          task.challenge_task.url_text,
        );

        const retweetData = await this.submitTaskService.getReTweets(tweetId);
        if (retweetData && retweetData.length) {
          target_screen_name = this.submitTaskService.getLastElement(
            task.submitted_by.twitter_url,
          );
          const verifyData = retweetData.filter((retweet) => {
            if (
              retweet.user.screen_name == target_screen_name &&
              retweet.retweeted_status.id_str == tweetId
            ) {
              return retweet;
            }
          });
          if (verifyData.length > 0) {
            const obj = {
              id: task.id,
              isVerified: true,
            };
            await this.submitTaskService.update(obj);
            return { verified: true };
          } else {
            return { verified: false, message: 'retweet not found' };
          }
        } else {
          return { verified: false, message: 'retweet not found' };
        }
        break;
      case 'twitter_quote':
        tweetId = this.submitTaskService.getLastElement(
          task.challenge_task.url_text,
        );
        target_screen_name = this.submitTaskService.getLastElement(
          task.submitted_by.twitter_url,
        );
        const quoteTweetData = await this.submitTaskService.getQuoteTweets(
          target_screen_name,
        );
        if (quoteTweetData && quoteTweetData.length > 0) {
          console.log(target_screen_name, task.challenge_task.template_text);
          const verifyData = quoteTweetData.filter((quoted) => {
            if (
              quoted.user.screen_name == target_screen_name &&
              quoted.text.includes(task.challenge_task.template_text) &&
              quoted.is_quote_status &&
              quoted.quoted_status_id_str == tweetId
            ) {
              return quoted;
            }
          });
          if (verifyData.length > 0) {
            const obj = {
              id: task.id,
              isVerified: true,
            };
            await this.submitTaskService.update(obj);
            return { verified: true };
          } else {
            return { verified: false, message: 'quoted tweet not found' };
          }
        } else {
          return { verified: false, message: 'quoted tweet not found' };
        }
        break;
      case 'twitter_bio':
        target_screen_name = this.submitTaskService.getLastElement(
          task.submitted_by.twitter_url,
        );
        const userBio = await this.submitTaskService.getTweetUserBio(
          target_screen_name,
        );
        console.log(target_screen_name, task.challenge_task.template_text);
        if (
          userBio &&
          userBio.id_str &&
          userBio.description.includes(task.challenge_task.template_text)
        ) {
          const obj = {
            id: task.id,
            isVerified: true,
          };
          await this.submitTaskService.update(obj);
          return { verified: true };
        } else {
          return { verified: false, message: 'Bio not updated' };
        }
        break;
    }
  }
}
