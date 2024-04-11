import {BaseMediaWebhookPayload} from './base';

export interface MediaResumeWebhookPayload extends BaseMediaWebhookPayload {
  event: 'media.resume';
}
