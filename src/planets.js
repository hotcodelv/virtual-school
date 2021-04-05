import earth from "./globe.jpg";
import sun from "./sun.jpg";
import moon from "./moon.jpg";
import mercury from "./mercury.jpg";
import venus from "./venus.jpg";
import mars from "./mars.jpg";
import jupiter from "./jupiter.jpg";
import saturn from "./saturn.jpg";
import uranus from "./uranus.jpg";
import neptune from "./neptune.jpg";
import pluto from "./pluto.png";

export const planet_data = [
  {
    name: "mercury",
    distance_KM: 57910000,
    distance_AU: 0.387,
    diameter: 4800,
    period_days: 88,
    rotation_days: 59,
    inclination: 7,
    texture: mercury,
  },
  {
    name: "venus",
    distance_KM: 108200000,
    distance_AU: 0.732,
    diameter: 12100,
    period_days: 225,
    rotation_days: 243,
    inclination: 3.9,
    texture: venus,
  },
  {
    name: "earth",
    distance_KM: 149600000,
    dustance_AU: 1,
    diameter: 12750,
    period_days: 365,
    rotation_days: 1,
    inclination: 0,
    texture: earth,
    attachment: {
      name: "moon",
      texture: moon,
      diameter: 3474,
      period_days: 27.3,
      distance_KM: 384400,
      inclination: 0,
      rotation_days: 243,
    },
  },
  {
    name: "mars",
    distance_KM: 227940000,
    distance_AU: 1.524,
    diameter: 6800,
    period_days: 697,
    rotation_days: 1.017,
    inclination: 1.85,
    texture: mars,
  },
  {
    name: "jupiter",
    distance_KM: 778330000,
    distance_AU: 5.203,
    diameter: 142800,
    period_days: 4234,
    rotation_days: 0.417,
    inclination: 1.3,
    texture: jupiter,
  },
  {
    name: "saturn",
    distance_KM: 1424600000,
    distance_AU: 9.523,
    diameter: 120660,
    period_days: 10752.9,
    rotation_days: 0.433,
    inclination: 2.49,
    texture: saturn,
  },
  {
    name: "uranus",
    distance_KM: 2873550000,
    distance_AU: 19.208,
    diameter: 51800,
    period_days: 30660,
    rotation_days: 0.708,
    inclination: 0.77,
    texture: uranus,
  },
  {
    name: "neptune",
    distance_KM: 4501000000,
    distance_AU: 30.087,
    diameter: 49500,
    period_days: 60225,
    rotation_days: 0.833,
    inclination: 1.77,
    texture: neptune,
  },
  {
    name: "pluto",
    distance_KM: 5945900000,
    distance_AU: 39.746,
    diameter: 33000, //palielinam 10x savadak nevar redzet
    period_days: 90520,
    rotation_days: 6.4,
    inclination: 17.2,
    texture: pluto,
  },
];
