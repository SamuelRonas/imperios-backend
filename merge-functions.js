import fs from "fs";
import YAML from "yaml";

const login = YAML.parse(fs.readFileSync("src/main/login/functions.yml", "utf8"));
const characters = YAML.parse(fs.readFileSync("src/main/characters/functions.yml", "utf8"));
const event = YAML.parse(fs.readFileSync("src/main/event/functions.yml", "utf8"));

export default {
  ...login,
  ...characters,
  ...event
};
