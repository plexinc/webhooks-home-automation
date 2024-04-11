import type {Light} from '../types/config/light';
import {api as hueApi, discovery} from "node-hue-api";
import rawApplicationConfig from '../config/application.json';
import {ApplicationConfig} from "../types/config/application";
import {Api} from "node-hue-api/dist/cjs/api/Api";
const applicationConfig = rawApplicationConfig as ApplicationConfig;

console.log("Application config:", applicationConfig);

let bridgeIpAddress: string | null = null;
let authenticatedHueApi: Api | null = null;
export async function discoverBridge() {
  const discoveryResults = await discovery.nupnpSearch();

  if (discoveryResults.length === 0) {
    console.error('Failed to resolve any Hue Bridges');
    return null;
  } else {
    // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
    return discoveryResults[0].ipaddress;
  }
}

export default async function SwitchHueLight(light: Light, shouldTurnOn: boolean) {
  try {
    const ipAddress = bridgeIpAddress || await discoverBridge();
    bridgeIpAddress = ipAddress;

    if (ipAddress === null) {
      console.error('No Hue Bridge was found. Please try again.');
      return;
    }

    console.log('Bridge found at IP address:', ipAddress);

    console.log('Creating authenticated API instance...');
    // Create an unauthenticated instance of the Hue API so that we can create a new user
    const authenticatedApi = authenticatedHueApi || await hueApi.createLocal(ipAddress).connect(applicationConfig.hueUsername);
    authenticatedHueApi = authenticatedApi as Api;
    console.log('Authenticated API instance created!');

    console.log('Setting light state...')
    const response = await authenticatedApi.lights.setLightState(light.id, {
      on: shouldTurnOn,
      brightness: shouldTurnOn ? 100 : 0,
    });
    console.log('Light state set:', response);
  } catch (error) {
    console.error('Failed to switch light, error:', error);
  }

  return;
}
