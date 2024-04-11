import express from 'express';
import multer from 'multer';
import { WebhookPayload } from 'types/payloads';
import { switchLight } from './switches';

import rawApplicationConfig from './config/application.json';
import {ApplicationConfig} from "./types/config/application";
const applicationConfig = rawApplicationConfig as ApplicationConfig;

console.log("Application config:", applicationConfig);

const app = express();
const upload = multer({ dest: '/tmp/' });

app.use(express.json());

app.post('/', upload.single('thumb'), async (req, res) => {
  const payload = JSON.parse(req.body.payload) as WebhookPayload;

  console.log('payload:', payload);

  console.log('Got webhook for', payload.event);

  if (
    payload.event !== 'media.play'
    && payload.event !== 'media.pause'
    && payload.event !== 'media.resume'
    && payload.event !== 'media.stop'
  ) {
    console.log('Ignoring incompatible event');
    return res.sendStatus(200);
  }

  if (payload.Metadata.type === 'track') {
    console.log('Ignoring track event');
    return res.sendStatus(200);
  }

  for (const {deviceId, lightId} of applicationConfig.associations) {
    if (payload.Player.uuid !== deviceId) {
      continue;
    }

    console.log('Found association for device', deviceId, 'and light', lightId);

    const light = applicationConfig.lights.find((l) => l.id === lightId);

    if (!light) {
      console.error('Light config not found');
      return res.sendStatus(200);
    }

    if (payload.event === 'media.play' || payload.event === 'media.resume') {
      console.log('Turning light off');

      await switchLight(light, false);
    }

    if (payload.event === 'media.pause' || payload.event === 'media.stop') {
      console.log('Turning light on');

      await switchLight(light, true);
    }
  }

  res.sendStatus(200);
});

app.listen(12000);
console.log('Listening for incoming webhooks on port 12000');
