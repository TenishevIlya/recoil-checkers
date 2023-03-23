export interface CheckerI {
  top: number;
  left: number;
  mode: CheckerMode;
}

export enum CheckerMode {
  white = "white",
  black = "black",
}
