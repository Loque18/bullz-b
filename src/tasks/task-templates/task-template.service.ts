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
    await this.taskTemplateRepository
      .createQueryBuilder()
      .insert()
      .into(TaskTemplate)
      .values(templates)
      .orUpdate({
        conflict_target: ['identifier'],
        overwrite: [
          'social_name',
          'task_name',
          'button_title_header',
          'button_titles',
          'is_url',
          'is_description',
          'is_template',
          'url_header',
          'description_header',
          'template_header',
          'url_placeholder',
          'description_placeholder',
          'template_placeholder',
          'info_text',
          'is_file_needed',
          'is_url_needed',
          'is_internal',
          'is_private_public',
          'is_second_url',
          'second_url_header',
          'second_url_placeholder',
          'submit_card_title',
          'submit_card_button_text',
        ],
      })
      .execute();
  }

  // updateTemplate(template): Promise<any> {
  //   return this.taskTemplateRepository
  //     .createQueryBuilder()
  //     .update(TaskTemplate)
  //     .set(template)
  //     .where('identifier = :identifier', { identifier: template.identifier })
  //     .execute();
  // }

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
