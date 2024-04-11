import {BaseMediaWebhookPayload} from './base';

export interface MediaPlayWebhookPayload extends BaseMediaWebhookPayload {
  event: 'media.play';
}
