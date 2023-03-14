import { Injectable } from '@nestjs/common';
import { SubmitTask } from './submit-task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Submit } from 'src/nft-challenge/submits/submit.entity';
import axios from 'axios';
@Injectable()
export class SubmitTaskService {
  constructor(
    @InjectRepository(SubmitTask)
    private submitTaskRepository: Repository<SubmitTask>,
  ) {}

  getSubmitTasks(challenge_task_id, user_id): Promise<any> {
    return this.submitTaskRepository
      .createQueryBuilder('SubmitTask')
      .leftJoin('SubmitTask.submitted_by', 'submitted_by')
      .leftJoin('SubmitTask.challenge_task', 'challenge_task')
      .where('submitted_by.id = :id', { id: user_id })
      .andWhere('challenge_task.id = :challenge_task_id', {
        challenge_task_id: challenge_task_id,
      })
      .getOne();
  }

  getSubmitTasksById(submit_task_id): Promise<any> {
    console.log('getSubmitTasksById', submit_task_id);
    return this.submitTaskRepository
      .createQueryBuilder('SubmitTask')
      .leftJoinAndSelect('SubmitTask.submitted_by', 'submitted_by')
      .leftJoinAndSelect('SubmitTask.challenge_task', 'challenge_task')
      .leftJoinAndSelect('challenge_task.task_template', 'task_template')
      .where('SubmitTask.id = :id', { id: submit_task_id })
      .getOne();
  }

  addSubmitTask(createSubmitTaskDTO): Promise<any> {
    return this.submitTaskRepository.save(createSubmitTaskDTO);
  }

  update(updateSubmitTaskDTO): Promise<any> {
    return this.submitTaskRepository.update(
      updateSubmitTaskDTO.id,
      updateSubmitTaskDTO,
    );
  }

  updateSubmit(_submitTask): Promise<any> {
    // console.log('_submitTask', _submitTask);
    const query = this.submitTaskRepository
      .createQueryBuilder('SubmitTask')
      .update()
      .set({ submit: _submitTask.submit })
      .where({ id: In(JSON.parse(_submitTask.task_id_list)) });
    // console.log('_submitTask', query.getSql());
    return query.execute();

    // const submitTask = new SubmitTask();
    // submitTask.id = _submitTask.id;
    // const submit = new Submit();
    // submit.id = _submitTask.submit_id;
    // submitTask.submit = submit;
    // return this.submitTaskRepository.update(submitTask.id, submitTask);
  }

  async getTwitterFollow(
    source_screen_name: string,
    target_screen_name: string,
  ): Promise<any> {
    const result = await axios({
      method: 'GET',
      url: `https://api.twitter.com/1.1/friendships/show.json?source_screen_name=${source_screen_name}&target_screen_name=${target_screen_name}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }

  getLastElement(url: string) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  async getTwitterLike(
    target_screen_name: string,
    tweetId: string,
  ): Promise<any> {
    const result = await axios({
      method: 'GET',
      url: `https://api.twitter.com/1.1/favorites/list.json?screen_name=${target_screen_name}&max_id=${tweetId}&include_entities=false&count=1`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }

  async getReTweets(tweetId: string): Promise<any> {
    const result = await axios({
      method: 'GET',
      url: `https://api.twitter.com/1.1/statuses/retweets/${tweetId}.json?count=100`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }

  async getQuoteTweets(target_screen_name: string): Promise<any> {
    const result = await axios({
      method: 'GET',
      url: `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${target_screen_name}&count=40`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }

  async getTweetUserBio(target_screen_name: string): Promise<any> {
    const result = await axios({
      method: 'GET',
      url: `https://api.twitter.com/1.1/users/show.json?screen_name=${target_screen_name}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }
}
