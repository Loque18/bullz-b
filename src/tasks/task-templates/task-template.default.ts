import { Injectable } from '@nestjs/common';

@Injectable()
export class DefaultTemplates {
  getTemplates() {
    return [
      {
        social_name: 'Twitter',
        identifier: 'twitter_follow',
        task_name: 'Follow on Twitter',
        button_title_header: 'Follow the account on Twitter',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Enter a username',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a username',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Follow on Twitter',
        submit_card_button_text: 'Visit Profile',
      },
      {
        social_name: 'Twitter',
        identifier: 'twitter_like',
        task_name: 'Like a Tweet',
        button_title_header: 'Like the tweet on Twitter',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Tweet URL',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a Tweet URL',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Like Tweet',
        submit_card_button_text: 'Visit Profile',
      },
      {
        social_name: 'Twitter',
        identifier: 'twitter_retweet',
        task_name: 'Retweet a Tweet',
        button_title_header: 'Re-tweet a Tweet on Twitter',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Tweet URL',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a Tweet URL',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: true,
        is_url_needed: true,
        is_internal: true,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Re-Tweet Tweet',
        submit_card_button_text: 'Visit Profile',
      },
      {
        social_name: 'Twitter',
        identifier: 'twitter_quote',
        task_name: 'Quote a Tweet',
        button_title_header: 'Quote a Tweet on Twitter',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: true,
        is_template: true,
        url_header: 'Tweet URL',
        description_header: 'Describe Tweet',
        template_header: 'Add template (optional)',
        url_placeholder: 'Enter a Tweet URL',
        description_placeholder: 'Enter Tweet description',
        template_placeholder: 'Enter Tweet template',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Quoted Re-Tweet',
        submit_card_button_text: 'Visit Profile',
      },
      {
        social_name: 'Twitter',
        identifier: 'twitter_create',
        task_name: 'Create Tweet on Twitter',
        button_title_header:
          'Create a Tweet on Twitter following the requirements',
        button_titles: ['Submit'],
        is_url: false,
        is_description: true,
        is_template: true,
        url_header: '',
        description_header: 'Describe Tweet',
        template_header: 'Add template (optional)',
        url_placeholder: '',
        description_placeholder: 'Enter Tweet description',
        template_placeholder: 'Enter Tweet template',
        info_text: '',
        is_file_needed: true,
        is_url_needed: true,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Create Tweet',
        submit_card_button_text: '',
      },
      {
        social_name: 'Twitter',
        identifier: 'twitter_bio',
        task_name: 'Twitter bio with specified text',
        button_title_header: 'Add the specified text in your twitter bio',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Twitter bio includes',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter text',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: true,
        is_url_needed: true,
        is_internal: true,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Twitter Bio',
        submit_card_button_text: 'Visit Profile',
      },
      {
        social_name: 'Instagram',
        identifier: 'instagram_create_post',
        task_name: 'Create a Post on Instagram',
        button_title_header:
          'Create a Post on Instagram following the requirements',
        button_titles: ['Submit'],
        is_url: false,
        is_description: true,
        is_template: true,
        url_header: '',
        description_header: 'Describe Instagram Post',
        template_header: 'Add caption template (optional)',
        url_placeholder: '',
        description_placeholder: 'Enter Post description',
        template_placeholder: 'Enter caption template',
        info_text: '',
        is_file_needed: true,
        is_url_needed: true,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Create Post',
        submit_card_button_text: '',
      },
      {
        social_name: 'Instagram',
        identifier: 'instagram_create_reel',
        task_name: 'Create a Reel on Instagram',
        button_title_header:
          'Create a Reel on Instagram following the requirements',
        button_titles: ['Submit'],
        is_url: false,
        is_description: true,
        is_template: true,
        url_header: '',
        description_header: 'Describe Instagram Post',
        template_header: 'Add caption template (optional)',
        url_placeholder: '',
        description_placeholder: 'Enter Post description',
        template_placeholder: 'Enter caption template',
        info_text: '',
        is_file_needed: true,
        is_url_needed: true,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Create Reel',
        submit_card_button_text: '',
      },
      {
        social_name: 'TikTok',
        identifier: 'tiktok_create_video',
        task_name: 'Create a video on TikTok',
        button_title_header:
          'Create a Video on TikTok following the requirements',
        button_titles: ['Submit'],
        is_url: false,
        is_description: true,
        is_template: true,
        url_header: '',
        description_header: 'Describe TikTok Video',
        template_header: 'Add caption template (optional)',
        url_placeholder: '',
        description_placeholder: 'Enter Video description',
        template_placeholder: 'Enter caption template',
        info_text: '',
        is_file_needed: true,
        is_url_needed: true,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Create TikTok',
        submit_card_button_text: '',
      },
      {
        social_name: 'Discord',
        identifier: 'discord_join',
        task_name: 'Join a discord server',
        button_title_header: 'Join the discord server as a member',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Discord Server URL',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a Discord Server URL',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Join Discord Server',
        submit_card_button_text: 'Visit Profile',
      },
      {
        social_name: 'Telegram',
        identifier: 'telegram_join',
        task_name: 'Join a Channel',
        button_title_header: 'Join the Telegram channel as a member',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Telegram Channel URL',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a Telegram Channel URL',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: true,
        is_second_url: true,
        second_url_header: 'Chat Title',
        second_url_placeholder: 'Enter a Chat Title',
        submit_card_title: 'Join Telegram Channel',
        submit_card_button_text: 'Visit Profile',
      },
      {
        social_name: 'Youtube',
        identifier: 'youtube_watch_video',
        task_name: 'Watch a video on YouTube',
        button_title_header: 'Watch a video on YouTube',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'YouTube Video URL',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a YouTube video URL',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Watch video',
        submit_card_button_text: 'Completed',
      },
      {
        social_name: 'Youtube',
        identifier: 'youtube_visit_channel',
        task_name: 'Visit a Channel on YouTube',
        button_title_header: 'Visit the YouTube channel',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'YouTube Channel URL',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a YouTube Channel URL',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Visit Channel',
        submit_card_button_text: 'Completed',
      },
      {
        social_name: 'Youtube',
        identifier: 'youtube_create_video',
        task_name: 'Create a video on YouTube',
        button_title_header:
          'Create a Video on YouTube following the requirements',
        button_titles: ['Submit'],
        is_url: false,
        is_description: true,
        is_template: true,
        url_header: '',
        description_header: 'Describe YouTube Video',
        template_header: 'Add description template (optional)',
        url_placeholder: '',
        description_placeholder: 'Enter Video description',
        template_placeholder: 'Enter description template',
        info_text: '',
        is_file_needed: true,
        is_url_needed: true,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Create YouTube',
        submit_card_button_text: '',
      },
      {
        social_name: 'Visit Website',
        identifier: 'visit_website',
        task_name: 'Visit website',
        button_title_header: 'Visit the website and check it out',
        button_titles: ['Start', 'Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Website URL',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter a website URL',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: false,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Visit Website',
        submit_card_button_text: 'Completed',
      },
      {
        social_name: 'Question & Answer',
        identifier: 'question_with_answer',
        task_name: 'Q&A with specified answer',
        button_title_header: 'Answer the question below correctly:',
        button_titles: ['Verify'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Enter your question',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter your question',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: true,
        is_internal: false,
        is_private_public: false,
        is_second_url: true,
        second_url_header: 'Enter the accepted answer',
        second_url_placeholder: 'Enter the accepted answer',
        submit_card_title: 'Specific Question',
        submit_card_button_text: '',
      },
      {
        social_name: 'Question & Answer',
        identifier: 'question_without_answer',
        task_name: 'Open-ended question',
        button_title_header: 'Answer the question below in any way you like:',
        button_titles: ['Submit'],
        is_url: true,
        is_description: false,
        is_template: false,
        url_header: 'Describe your question',
        description_header: '',
        template_header: '',
        url_placeholder: 'Enter your question',
        description_placeholder: '',
        template_placeholder: '',
        info_text: '',
        is_file_needed: false,
        is_url_needed: true,
        is_internal: false,
        is_private_public: false,
        is_second_url: false,
        second_url_header: '',
        second_url_placeholder: '',
        submit_card_title: 'Open Question',
        submit_card_button_text: '',
      },
    ];
  }
}
