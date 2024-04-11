import {
  api as hueApi,
  ApiError,
} from 'node-hue-api';
import {Light, SwitchMethod} from './types/config/light';
import * as fs from 'fs';
import rawApplicationConfig from './config/application.json';
import {ApplicationConfig} from "./types/config/application";
import {discoverBridge} from "./switches/hue";
const applicationConfig = rawApplicationConfig as ApplicationConfig;

console.log("Application config:", applicationConfig);

const appName = 'plex-home-automation';
const deviceName = 'webhook-handler';

async function discoverAndAuthenticate() {
  console.log('Finding bridge...');
  const ipAddress = await discoverBridge();

  if (ipAddress === null) {
    console.error('No Hue Bridge was found. Please try again.');
    return;
  }

  console.log('Bridge found at IP address:', ipAddress);

  let createdUser;
  try {
    if (applicationConfig.hueUsername.length === 0) {
      console.log('Creating local API instance...');
      // Create an unauthenticated instance of the Hue API so that we can create a new user
      const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();
      console.log('Local API instance created!')

      createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
      console.log('*******************************************************************************\n');
      console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
        'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
        'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
      console.log(`Hue Bridge User: ${createdUser.username}`);
      console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
      console.log('*******************************************************************************\n');

      // Save username to applicationConfig
      applicationConfig.hueUsername = createdUser.username;

      // Save the username to the applicationConfig
      fs.writeFileSync('./config/application.json', JSON.stringify(applicationConfig, null, 2));
    }

    console.log('Creating authenticated API instance...');
    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi.createLocal(ipAddress).connect(applicationConfig.hueUsername);
    console.log('Created!');

    // Do something with the authenticated user/api
    const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
    console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

    return authenticatedApi;
  } catch(err) {
    if (err instanceof ApiError && err.getHueErrorType() === 101) {
      console.error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
    } else {
      console.error('Unexpected error:', err);
    }
  }
}

async function main() {
  // Invoke the discovery and create user code
  const authenticatedApi = await discoverAndAuthenticate();

  if (!authenticatedApi) {
    return;
  }

  // If we have a valid authenticatedApi instance, we can start to use it to interact with the Hue Bridge
  console.log('Authenticated API created!');
  const lights = await authenticatedApi.lights.getAll();

  console.log('Getting lights...')
  console.log('lights:', lights);

  // loop lights and see if light.id is in the lights
  const applicationLights: Light[] = applicationConfig.lights;
  const formattedLights = [];

  for (const light of lights) {
    const formattedLight: Light = {
      id: light.id.toString(),
      switchMethod: SwitchMethod.HUE,

      note: light.name,
    };

    formattedLights.push(formattedLight);

    // loop lights and see if formattedLight.id is in the lights
    const lightIndex = applicationLights.findIndex((l) => l.id === formattedLight.id);

    if (lightIndex !== -1) {
      console.log('Light already exists, updating:', applicationLights[lightIndex]);
      applicationLights[lightIndex] = {
        ...applicationLights[lightIndex],
        ...formattedLight,
      };
      continue;
    }

    console.log('Light does not exist, adding:', formattedLight);
    applicationLights.push({
      ...formattedLight,
      note: '',
    });
  }

  console.log('Lights:', formattedLights);

  // Save the updated application config
  console.log('Saving application config...');
  applicationConfig.lights = applicationLights;
  console.log('Application config:', applicationConfig);

  // Save the updated application config
  console.log('Saving application config...');

  // write to file (overwrite existing data)
  fs.writeFileSync('./config/application.json', JSON.stringify(applicationConfig, null, 2));

  console.log('Application config updated!');
}
main();
