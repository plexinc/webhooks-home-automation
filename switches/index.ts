import {Light, SwitchMethod} from '../types/config/light';
import switchHueLight from "./hue";

export async function switchLight(light: Light, shouldTurnOn: boolean): Promise<void> {
  console.log('Switching light', light.id, 'using switchMethod', light.switchMethod);

  if (light.switchMethod === SwitchMethod.HUE) {
    return switchHueLight(light, shouldTurnOn);
  }

  console.error('Unknown light switchMethod:', light.switchMethod);
}
