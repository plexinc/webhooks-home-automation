export interface Light {
  id: string;
  switchMethod: SwitchMethod;

  note: string;
}

export enum SwitchMethod {
  HUE = 'hue',
}
