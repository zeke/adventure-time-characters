import got from 'got';
import * as cheerio from 'cheerio';
import * as alphabet from 'alphabet';
import sleep from 'sleep-promise';
import fs from 'fs'
import path from 'path'

const host = "https://adventuretime.fandom.com"
const __dirname = path.resolve();

async function main() {

  let characterUrls = []
  let characterData = []

  for (const letter of alphabet.upper) {
    const url = `${host}/wiki/Category:Characters?from=${letter}`
    console.log(`\n\n${url}`)
    const urls = await getCharacterUrlsFromPage(url)
    console.log({urls})
    characterUrls = characterUrls.concat(urls)
    await sleep(100)
  }

  console.log({characterUrls})

  for (const characterUrl of characterUrls) {
    const data = await getDataFromCharacterPage(characterUrl)
    characterData.push(data)
    await sleep(100)
  }

  const json = JSON.stringify(characterData, null, 2)
  const file = path.join(__dirname, "characters.json")
  fs.writeFileSync(file, json)
}

async function getCharacterUrlsFromPage(url) {
  // <a href="/wiki/Abraham_Lincoln" class="category-page__member-link" title="Abraham Lincoln">Abraham Lincoln</a>
  const page = await got(url)
  const $ = cheerio.load(page.body)

  return $('a.category-page__member-link').map((i, el) => {
    return host + $(el).attr('href')
  }).get().filter(url => !url.includes("User:"))
}

async function getDataFromCharacterPage(url) {
  console.log("getDataFromCharacterPage: " + url)
  const page = await got(url)
  const $ = cheerio.load(page.body)
  const title = $('h1.page-header__title').text().trim()
  const imageUrls = $(".mw-parser-output img").map((i, el) => {
    const src = $(el).attr('src')
    return (src && src.startsWith("/")) ? host + src : src
  }).get()
  .filter(url => url && url.length && url.startsWith("http"))
  return {url, title, imageUrls}
}

main()