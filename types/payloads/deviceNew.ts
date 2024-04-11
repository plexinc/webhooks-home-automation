import {BaseWebhookPayload} from './base';

export interface DeviceNewWebhookPayload extends BaseWebhookPayload {
  event: 'device.new';
}
