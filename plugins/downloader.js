const { bot, getUrl, isIgUrl, getJson, isPrivate, isUrl, getBuffer, validateQuality } = require('../lib/')
const { webp2mp4, toAudio } = require('../lib/functions')
const { ytsdl } = require('../lib/ytdl')

bot(
 {
  pattern: 'insta',
  fromMe: isPrivate,
  desc: 'To download instagram media',
  type: 'download',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.sendMessage(message.jid, 'Give me a link')
  const url = getUrl(match.trim())[0]
  if (!url) return await message.sendMessage(message.jid, 'Invalid link')
  if (!isIgUrl(url)) return await message.sendMessage(message.jid, 'Invalid Instagram link')
  if (!isIgUrl(match.trim())) return await message.sendMessage(message.jid, 'Invalid Instagram link')
  try {
   const data = await getJson(`https://api.thexapi.xyz/api/v1/download/instagram?url=${url}`)

   if (data.data?.length == 0) return await message.sendMessage(message.jid, 'No media found on the link')
   data.data.forEach(async (url) => {
    await message.sendFile(url)
   })
  } catch (e) {
   await message.sendMessage(message.jid, 'Error: ' + e)
  }
 }
)
bot(
 {
  pattern: 'mp4',
  fromMe: isPrivate,
  desc: 'converts video/voice to mp4',
  type: 'downloader',
 },
 async (message, match, m) => {
  if (!message.reply_message.video || !message.reply_message.sticker || !message.reply_message.audio) return await message.reply('_Reply to a sticker/audio/video_')
  let buff = await m.quoted.download()
  if (message.reply_message.sticker) {
   buff = await webp2mp4(buff)
  } else {
   buff = await toAudio(buff, 'mp4')
  }
  return await message.sendMessage(message.jid, buff, { mimetype: 'video/mp4' }, 'video')
 }
)
bot(
 {
  pattern: 'yta',
  fromMe: isPrivate,
  desc: 'Download audio from youtube',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.reply('Give me a youtube link')
  if (!isUrl(match)) return await message.reply('Give me a youtube link')
  let { dlink, title } = (await getJson(`https://api.thexapi.xyz/api/v1/download/youtube/audio?url=${match}`)).data
  await message.reply(`_Downloading ${title}_`)
  let buff = await getBuffer(dlink)
  return await message.sendMessage(
   message.jid,
   buff,
   {
    mimetype: 'audio/mpeg',
    filename: title + '.mp3',
   },
   'audio'
  )
 }
)

bot(
 {
  pattern: 'ytv',
  fromMe: isPrivate,
  desc: 'Download audio from youtube',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  let url = getUrl(match)[0]
  if (!url) return await message.reply('Give me a youtube link\n\nExample: ytv youtube.com/watch?v=xxxxx 480p')
  let quality = match.split(';')[1]
  if (quality && !validateQuality(quality)) {
   return await message.reply('Invalid Resolution \nSupported: 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, 2160p')
  } else if (!quality) quality = '360p'
  if (!match) return await message.reply('Give me a youtube link\n\nExample: ytv youtube.com/watch?v=xxxxx 480p')
  if (!isUrl(match)) return await message.reply('Give me a youtube link\n\nExample: ytv youtube.com/watch?v=xxxxx 480p')
  let requrl = `https://api.thexapi.xyz/api/v1/download/youtube/video?url=${url}&quality=${quality}`
  let response = (await getJson(requrl)).data
  const { dlink, title } = response
  console.log(response)
  await message.reply(`_Downloading ${title}_`)
  return await message.sendMessage(
   message.jid,
   dlink,
   {
    mimetype: 'video/mp4',
    filename: title + '.mp4',
   },
   'video'
  )
 }
)

bot(
 {
  pattern: 'song',
  fromMe: isPrivate,
  desc: 'Download audio from youtube',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.reply('Give me a query')
  let { dlink, title } = await ytsdl(match)
  await message.reply(`_Downloading ${title}_`)
  let buff = await getBuffer(dlink)
  return await message.sendMessage(
   message.jid,
   buff,
   {
    mimetype: 'audio/mpeg',
    filename: title + '.mp3',
   },
   'audio'
  )
 }
)

bot(
 {
  pattern: 'video',
  fromMe: isPrivate,
  desc: 'Download video from youtube',
 },
 async (message, match) => {
  match = match || message.reply_message.text
  if (!match) return await message.reply('Give me a query')
  let { dlink, title } = await ytsdl(match, 'video')
  await message.reply(`_Downloading ${title}_`)
  return await message.sendMessage(
   message.jid,
   dlink,
   {
    mimetype: 'video/mp4',
    filename: title + '.mp4',
   },
   'video'
  )
 }
)
