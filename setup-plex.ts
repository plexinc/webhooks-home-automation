import {JSDOM} from 'jsdom';
import * as fs from 'fs';
import {Device} from './types/config/device';import rawApplicationConfig from './config/application.json';
import {ApplicationConfig} from "./types/config/application";
const applicationConfig = rawApplicationConfig as ApplicationConfig;

console.log("Application config:", applicationConfig);

const plexApiKey = '';
const plexServerUrl = '127.0.0.1';
const plexServerPort = 32400;

async function main() {
  if (plexApiKey.length === 0) {
    // TODO: Figure out a way of getting it automatically
    console.error('Please set the plexApiKey variable to your Plex API key.');
    return;
  }

  const response = await fetch(`http://${plexServerUrl}:${plexServerPort}/devices`, {
    method: 'GET',
    headers: {
      'X-Plex-Token': plexApiKey,
      'Accept': 'application/xml'
    },
  });

  const body = await response.text();

  const dom = new JSDOM(body);
  const doc = dom.window.document;

  // Get all Device elements
  const devices = doc.querySelectorAll('Device');
  const applicationDevices: Device[] = applicationConfig.devices;

  // Turn the Device elements into objects
  const formattedDevices = [];
  for (const device of devices) {
    if (!device.getAttribute('clientIdentifier')) {
      continue;
    }

    const formattedDevice = {
      id: parseInt(device.getAttribute('id') || '-1', 10),
      name: device.getAttribute('name') || 'Unknown',
      platform: device.getAttribute('platform') || 'Unknown',
      clientIdentifier: device.getAttribute('clientIdentifier') || 'Unknown',
      createdAt: parseInt(device.getAttribute('createdAt') || '-1', 10) * 1000,
    };

    formattedDevices.push(formattedDevice);

    // loop devices and see if formattedDevice.clientIdentifier is in the devices
    const deviceIndex = applicationDevices.findIndex((d) => d.clientIdentifier === formattedDevice.clientIdentifier);

    if (deviceIndex !== -1) {
      console.log('Device already exists, updating:', applicationDevices[deviceIndex]);
      applicationDevices[deviceIndex] = {
        ...applicationDevices[deviceIndex],
        ...formattedDevice,
      };
      continue;
    }

    console.log('Device does not exist, adding:', formattedDevice);
    applicationDevices.push({
      ...formattedDevice,
      note: '',
    });
  }

  console.log('Devices:', formattedDevices);

  // Save the updated application config
  console.log('Updating application config...');

  applicationConfig.devices = applicationDevices;

  console.log('applicationConfig:', applicationConfig);

  // write to file (overwrite existing data)
  fs.writeFileSync('./config/application.json', JSON.stringify(applicationConfig, null, 2));

  console.log('Application config updated!');
}
main();
