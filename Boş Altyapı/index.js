const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

client.commands;
client.prefix = "!"

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.commands = await setCommands()
});

async function setCommands() {
    commandFiles = fs.readdirSync('./commands')
    let commands = new Discord.Collection();
    commandFiles.forEach((v, i) => {
        let file = require(`./commands/${v}`)
        commands.set(v, {
            name: file.config.name,
            desc: file.config.desc,
            aliases: file.config.aliases,
            run: file.run  
        })   
    })

    return commands;
}

client.on("message", (message) => {
    if  (
        message.content.startsWith(client.prefix) && 
        (message.content.split(' ')[0] != client.prefix && message.content != client.prefix) &&
        client.commands.find(v => (v.name == (message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))) || (v.aliases.includes(message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))))
    ) {
        let command = client.commands.find(v => (v.name == (message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))) || (v.aliases.includes(message.content.split(' ')[0].replace("!", "") || message.content.replace("!", ""))))

        args = message.content.split(" ")
        args = args.slice(1, args.length) 
        command.run(client, message, args)
    }
})

client.login('');