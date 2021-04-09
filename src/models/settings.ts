export interface Settings {
  mainColor: string;
  secondaryColor: string;
  accentColor: string;
  fontColor: string;
  preferredView: "minimalistic" | "compact";
  angInf: "gr1" | "gr2";
  wf: "CH" | "DZ";
  lang: "gr1n" | "gr2n" | "gr3n" | "gr4r";
}

export const defaultSettings: Settings = {
  mainColor: "#18181A",
  accentColor: "#41B883",
  secondaryColor: "#27272A",
  fontColor: "#ffffff",
  preferredView: "minimalistic",
  angInf: "gr1",
  wf: "CH",
  lang: "gr4r",
};
