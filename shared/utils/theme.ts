import { Theme } from "../db/theme.ts";

const lookup: Record<string, Partial<Record<Theme, string>>> = {
  catchyness: {
    afrobeat: "beats",
    electronica: "beats",
    metal: "riffs",
    pop: "songs",
    rap: "beats",
    rnb: "beats",
  },
  immersion: {
    afrobeat: "vibe",
    electronica: "vibe",
    metal: "shoegaze",
    pop: "vibe",
    rap: "vibe",
    rnb: "vibe",
  },
  vocals: {
    electronica: "synths",
  },
};

export function createThemeFormatter(theme: Theme) {
  return (key: string) => {
    const isCapitalCased = key[0].toLowerCase() !== key[0];

    const values: Record<string, string> = lookup[key.toLowerCase()];
    const value = (values && values[theme]) || key;

    return isCapitalCased ? value[0].toUpperCase() + value.slice(1) : value;
  };
}
