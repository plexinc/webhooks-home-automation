import {BaseMediaWebhookPayload} from './base';

export interface MediaStopWebhookPayload extends BaseMediaWebhookPayload {
  event: 'media.stop';
}
