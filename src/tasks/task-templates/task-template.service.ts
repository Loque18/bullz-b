import { Injectable, OnModuleInit } from '@nestjs/common';
import { TaskTemplate } from './task-template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefaultTemplates } from './task-template.default';
@Injectable()
export class TaskTemplateService implements OnModuleInit {
  constructor(
    @InjectRepository(TaskTemplate)
    private taskTemplateRepository: Repository<TaskTemplate>,
    private defaultTemplates: DefaultTemplates,
  ) {}

  async onModuleInit() {
    console.log('onModuleInit');
    const taskCount = await this.getTaskCount();

    console.log('taskCount', taskCount);
    const templates = this.defaultTemplates.getTemplates();
    if (taskCount == 0) {
      console.log('templates', templates);

      for (let i = 0; i < templates.length; i++) {
        try {
          await this.addTemplate(templates[i]);
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      for (let i = 0; i < templates.length; i++) {
        try {
          await this.updateTemplate(templates[i]);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  updateTemplate(template): Promise<any> {
    return this.taskTemplateRepository
      .createQueryBuilder()
      .update(TaskTemplate)
      .set(template)
      .where('identifier = :identifier', { identifier: template.identifier })
      .execute();
  }

  getTasks(): Promise<any> {
    return this.taskTemplateRepository.find();
  }

  getTaskCount(): Promise<any> {
    return this.taskTemplateRepository.count();
  }

  addTemplate(template): Promise<any> {
    return this.taskTemplateRepository.save(template);
  }
}
