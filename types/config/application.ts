import {Light} from "./light";
import {Device} from "./device";

export interface ApplicationConfig {
  devices: Device[];
  lights: Light[];

  associations: {
    deviceId: Device['clientIdentifier'];
    lightId: Light['id'];

    note: string;
  }[];

  hueUsername: string;
}
