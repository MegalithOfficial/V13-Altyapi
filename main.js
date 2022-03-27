const fs = require('fs')
const path = require('path')
const { Client, Collection, Intents, MessageEmbed } = require('discord.js')
const db = require("quick.db")
const { appId, guildId, token } = require('./config.json')
const client = new Client({ intents: 32639 })
require("./command-loader.js")

////////////////

// Add command files
client.commands = new Collection()
const commandFiles = []

const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory)
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file)
    if (fs.statSync(absolute).isDirectory()) {
      getFilesRecursively(absolute)
    } else {
      commandFiles.push(absolute)
    }
  }
}
getFilesRecursively('./commands/')

for (const file of commandFiles) {
  const command = require(`./${file}`)
  client.commands.set(command.data.name, command)
}

// Add event files
const clientEventFiles = fs.readdirSync('./events/client').filter(file => file.endsWith('.js'))

for (const file of clientEventFiles) {
  const event = require(`./events/client/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}


client.on('guildMemberAdd', async (member) => {
console.log(member)
})

process.on('uncaughtException', err => {
	console.error(err)
  })

// Login
client.login(token)
