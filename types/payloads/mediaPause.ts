import {BaseMediaWebhookPayload} from './base';

export interface MediaPauseWebhookPayload extends BaseMediaWebhookPayload {
  event: 'media.pause';
}
