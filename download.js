import download from "download"
import sleep from 'sleep-promise';
import { createRequire } from "module";
import fs from "fs";
import path from "path";
const require = createRequire(import.meta.url);
const characters = require("./characters.json");
const extensions = [".jpg", ".jpeg", ".png", ".gif"];
const __dirname = path.resolve();

async function main() {
  console.log({characters})
  for (const character of characters) {
    for (const imageUrl of character.imageUrls) {
      console.log({imageUrl})
      const filename = character.title + " - " + imageUrl.split("/").find(segment => extensions.some(extension => segment.toLowerCase().endsWith(extension)))
      console.log(filename)
      
      if (fs.existsSync(path.join(__dirname, "data", filename))) {
        console.log("already exists", filename)
        continue
      }

      try{
        await download(imageUrl, 'data', {filename});
      } catch(err) {
        console.log(err)
      }
      
      await sleep(1000)
    }
  }
}

main()
