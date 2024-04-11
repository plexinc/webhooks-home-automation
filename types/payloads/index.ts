import {MediaPauseWebhookPayload} from './mediaPause';
import {MediaPlayWebhookPayload} from './mediaPlay';
import {MediaResumeWebhookPayload} from './mediaResume';
import { MediaStopWebhookPayload } from './mediaStop';
import {DeviceNewWebhookPayload} from "./deviceNew";

export type WebhookPayload = DeviceNewWebhookPayload | MediaPauseWebhookPayload | MediaPlayWebhookPayload | MediaResumeWebhookPayload | MediaStopWebhookPayload;