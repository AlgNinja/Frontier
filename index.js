const Discord = require("discord.js");

const config = require("./config.json");

const fs = require("fs");

const math = require('mathjs');

const randomPuppy = require('random-puppy');

const snekfetch = require(`snekfetch`);

const eclyssiaAPI = require('eclyssia-api');

const fetch = require('node-fetch');

const p = config.prefix;

client = new Discord.Client()

client.config = config;

const guild = new Discord.Guild(client);

client.on("ready", () => {
  console.log("lets go!");
  client.user.setPresence({ activity: { name: `${p}help for ${client.users.cache.size} users in ${client.guilds.cache.size} servers!  | CLOSED BETA` }, status: 'idle' })
});



client.on('message', async message => {
   let messageArray = message.content.split(" ");
   let command = messageArray[0]
   let args = messageArray.slice(1);
   if(message.author.bot) return;
   if(message.channel.type === "dm")  return message.channel.send("I'm a bot dude. Please don't message me.");

   if(message.content.startsWith(`${p}say`)) {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have the permissions to use this command.")
    if(message.member.hasPermission(`MANAGE_MESSAGES`)) {
      message.delete();
      if(args.length < 1) {
        message.channel.send("Uh, theres nothing to say?").then(m => m.delete(5000));
    }
    if(args[0].toLowerCase() === `embed`) {
     const em = new Discord.MessageEmbed()
     .setColor("RANDOM")
     .setDescription(args.slice(1).join (" "));
     message.channel.send(em);
    }else {
       message.channel.send(args.join(' '))
     }
    }
   }
   if(message.content.startsWith(`${p}guild`)) {
    message.channel.send(`Guild name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
   }
   if(message.content.startsWith(`${p}ban`)) {
    if(!message.member.hasPermission("BAN_MEMBERS", "KICK_MEMBERS")) return message.channel.sendMessage("You do not have the permissions for this.")
    let member = message.mentions.members.first();
    const channel = message.guild.channels.cache.find(c => c.name === "mod-logs")
    if(!channel) message.channel.send(`Please make a #mod-logs channel to use this command properly.`)
    if(!args[1]) message.channel.send("Please provide a reason for the report").then(m => m.delete(5000));
    else {
      member.ban().then((members) => {
        let ban = new Discord.MessageEmbed()
        .setColor("BA1B1D")
        .setTitle("Frontier Moderation-")
        .setTimestamp()
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter(message.guild.name, message.guild.iconURL)
        .setAuthor(`Banned by: ${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
        .addField(`Banned member:`, `${member.displayName}`)
        .addField(`Banned in:`,`${message.channel}`)
        .addField(`Reason:`, `${args.slice(1).join(" ")}`)
        return channel.send(ban);
        message.channel.send(`${member.displayName} has been banned. Check #mod-logs for more info.`)
      })
    }
  }
  if(message.content.startsWith(`${p}report`)) {
    if (message.deletable) message.delete();
    let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!rMember) return message.reply("Couldn't find that person?").then(m => m.delete(5000));
    if(rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot) message.channel.send("Can't report that member cuz they're admin").then(m => m.delete(5000));
    const channel = message.guild.channels.cache.find(c => c.name === "reports")
    if(!channel) return message.channel.send(`Couldn't find a "#reports" channel`).then(m => m.delete(5000));
    else {

    const report = new Discord.MessageEmbed()
    .setColor("#1bade2")
    .setTitle("Frontier Report-")
    .setTimestamp()
    .setThumbnail(rMember.user.displayAvatarURL())
    .setFooter(message.guild.name, message.guild.iconURL)
    .setAuthor(`Reported by: ${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
    .addField(`Reported member:`, `${rMember.displayName}`)
    .addField(`Reported in:`,`${message.channel}`)
    .addField(`Reason:`, `${args.slice(1).join(" ")}`)
    return channel.send(report);
  }
 }
 if(message.content.startsWith(`${p}kick`)) {
  if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You do not have the permissions for this.")
  let member = message.mentions.members.first();
  const channel = message.guild.channels.cache.find(c => c.name === "mod-logs")
  if(!channel) message.channel.send(`Please make a #mod-logs channel to use this command properly.`)
  if(!args[1]) message.channel.send("Please provide a reason for the report").then(m => m.delete(5000));
  else {
    member.kick().then((members) => {
      let kick = new Discord.MessageEmbed()
      .setColor("0x00AE86")
      .setTitle("Frontier Moderation-")
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter(message.guild.name, message.guild.iconURL)
      .setAuthor(`Kicked by: ${message.member.displayName}`, `${message.author.displayAvatarURL()}`)
      .addField(`Kicked member:`, `${member.displayName}`)
      .addField(`Kicked in:`,`${message.channel}`)
      .addField(`Reason:`, `${args.slice(1).join(" ")}`)
      return channel.send(kick);
      message.channel.send(`${member.displayName} has been kicked. Check #mod-logs for more info.`)
    })
  }
 }
 if(message.content.startsWith(`${p}rps`)) {
  let theirchoice = args[0];
  let rps = [`rock`, `paper`, `scissors`];
  let mychoice = rps[Math.floor(Math.random() * rps.length)];
  if((mychoice === `rock` && theirchoice === `scissors`) || (mychoice === `scissors` && theirchoice === `paper`) || (mychoice === `paper` && theirchoice === `rock`)) message.channel.send(` Hurray! I got ${mychoice} so I won this time! :smile:`)
  if(mychoice === theirchoice) message.channel.send(`I got ${mychoice} too! It's a tie!`)
  if((mychoice === `scissors` && theirchoice === `rock`) || (mychoice === `paper` && theirchoice === `scissors`) || (mychoice === `rock` && theirchoice === `paper`)) message.channel.send(`I got ${mychoice} this time around. You won... this time :angry:`)
  if(!args[0]) message.channel.send(`The command ${p}rps takes the parameters ***rock*** ***paper*** and ***scissors***. For example, ""${p}rps rock" Please try again.`)
  if(theirchoice != `rock` && theirchoice != `paper`  && theirchoice != `scissors`) message.channel.send(`Hey, you didnt say say a correct input. Just rock, paper, or scissors, remember?`)
 }
 if(message.content.startsWith(`${p}av`)) {
  let user = message.mentions.users.first();
   if(!user) user = message.author;
  let av = new Discord.MessageEmbed()
  .setTitle(`${user.username}'s Avatar`)
  .setImage(user.displayAvatarURL())
  .setColor('RANDOM')
  message.channel.send(av);
 }
 if(message.content.startsWith(`${p}ping`)) {
  message.channel.send(new Date().getTime() - message.createdTimestamp + " ms!");
}
if(message.content.startsWith(`${p}myinfo`)) {
  let embed = new Discord.MessageEmbed()
  .setAuthor(message.author.username)
  .setThumbnail(message.author.displayAvatarURL())
  .setDescription("This is the users info!")
  .setColor("9B59B6")
  .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
  .addField("ID", message.author.id)
  .addField("Created At", message.author.createdAt)
  message.channel.send(embed);
}
if(message.content.startsWith(`${p}mute`)) {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have manage messages.")

    let toMute = message.guild.member(message.mentions.users.first()) || message.guild.member(args[0]);
    if(!toMute) return message.channel.send("You didn't specify a user!");
    if(toMute.id === message.author.id) return message.channel.send("You can't mute yourself.");
    if(toMute.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You cannot mute a member that has a higher or same role as you.")
    let role = message.guild.roles.cache.find(r => r.name === "FrontierMuted");
    if(!role) {
     try {
      role = await message.guild.roles.create({
       data: {
        name: "FrontierMuted",
        color: "#000000",
        permissions: []
      }
    });
    message.guild.channels.cache.forEach((channel) => {
      if (channel.type == 'text') {
        channel.updateOverwrite(role, {
          deny: ['SEND_MESSAGES', `ADD_REACTIONS`],
        })
    } else if (channel.type == 'voice') {
        channel.updateOverwrite(role, {
          deny: [`SPEAK`],
        })

    }

   })




   }catch(e) {
     console.log(e.stack);
   }
  }
   console.log(role);
   if(toMute.roles.cache.has(role.id)) return message.channel.send("This member is already muted!")

   await toMute.roles.add(role);
   message.channel.send("I have muted them.")
   return;

 }
 if(message.content.startsWith(`${p}unmute`)) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have manage messages.");
  let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!toMute) return message.channel.send("You did not specify a user mention or ID!");
  let role = message.guild.roles.cache.find(r => r.name === "FrontierMuted");
  if(!role || !toMute.roles.cache.has(role.id)) return message.channel.send("This user is not muted!");
  await toMute.roles.remove(role);
  message.channel.send("I have unmuted them.");
  return;
  }
  if(message.content.startsWith(`${p}invite`)) {
    let invite = new Discord.MessageEmbed()
    .setTitle(`Hi ` + message.author.username + `, want to invite Frontier to your server? Here's the invite!` )
    .setDescription(`https://discordapp.com/api/oauth2/authorize?client_id=695813822723653683&permissions=8&scope=bot`)
    .addField(`One more thing:`, `Make sure you have Admin before you try to invite a bot to a server!`);
    message.channel.send(invite);
   }
   if(message.content.startsWith(`${p}help`)) {
    message.delete();
    let mod = new Discord.MessageEmbed()
    .setTitle('Moderation Commands')
    .setDescription(`The prefix is ${p} for all commands`)
    .setTimestamp()
    .setColor("RANDOM")
    .addField(`${p}kick <@user> <reason>:`, "Kicks a user off of a server(Mod/Admin only)")
    .addField(`${p}ban <@user> <reason>:`, `Bans a user off the server, only for strict punishment(Admin only!)`)
    .addField(`${p}report <@user> <reason>`, "Report someone breaking the rules for admin review(Requires `reports` channel)")
    .addField(`${p}mute <@user>:`, "~~Stops a user from talking on a server!(Admin/Mod only)~~ Command Currently Vaulted due to issues.")
    .addField(`${p}unmute:`, "~~Allows a user to be able to talk again if they were muted(Admin/Mod only)~~ Vaulted due to parent command being vaulted.")
    .addField(`${p}purge <amount>`, `Bulk delete up to 100 messages! (Admin/Mod only)`)
    .addField(`${p}setup`, `Setup instructions for best use of the bot on your server`);
    //------------------
    let general = new Discord.MessageEmbed()
    .setTitle(`Lists general use commands`)
    .setDescription(`the prefix is a ${p} for all commands`)
    .setColor("RANDOM")
    .addField(`${p}help:`, `Lists the Frontier commands`)
    .addField(`${p}myinfo:`, "Shows important info about you")
    .addField(`${p}av:`, "Returns your avatar/pfp")
    .addField(`${p}ping:`, `Returns ping in milliseconds(ms)`)
    .addField(`${p}invite:`, `Gives you an invite to add Frontier to your server`)
    .addField(`${p}say/${p}say embed <message>`, `makes the bot say what you wanna say, good for announcements and trolling new users into thinking its AI! You can even do it using an embed with ${p}say embed!`)
    .addField(`${p}support`, `Gives you an invite to the official Frontier discord server.`)
    .addField(`${p}guild`, `Tells you the amount of users and and the name of the guild you're in`)
    .addField(`${p}comingsoon`, `Shows the upcoming commands!`)
    .addField(`${p}nick`, `Changes  your nickname(Only works if youre not owner of the guild cuz discord.js is mean :/`);
    //------------------------
    let games = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`Minigames/funny commands to have some rnjoy yourself!`)
    .setDescription(`the prefix is a ${p} for all commands`)
    .addField(`${p}coinflip`, `Flip the coin!, see your luck!`)
    .addField(`${p}rps <parameters: rock, paper or scissors>`, `Play a game or rock, paper scissors against Frontier! Who will win?`)
    .addField(`${p}meme`, `Generates a random meme!(Requires an NSFW channel)`)
    .addField(`${p}triggered <@user(optional, if you dont add one, it will default to you)>`, `Sends a gif of the user triggered with image manipulation!`)
    .addField(`${p}dice`, `Roll the dice and see what number you get!`);
    message.author.send(mod);
    message.author.send(general);
    message.author.send(games);

    message.channel.send("Check your discord DMs :smile: Help message sent.");
  }
  if(message.content.startsWith(`${p}coinflip`)) {
    var number = Math.floor(Math.random() * 2);
    let heads = new Discord.MessageEmbed()
    .setTitle("Congratulations, you got heads!")
    .setImage("https://upload.wikimedia.org/wikipedia/commons/a/a0/2006_Quarter_Proof.png")
    .setColor("00FF00");
    let tails = new Discord.MessageEmbed()
    .setTitle(`Oof... you got tails. Better luck next time!`)
    .setImage(`https://upload.wikimedia.org/wikipedia/commons/4/4e/COBREcentavosecuador2000-2.png`)
    .setColor(`#FF0000`);
    if(number === 0) {
      message.channel.send(heads);
    } else if (number === 1) {
      message.channel.send(tails);
    } else {
      message.channel.send('Dang, there was a bug. Please contact one of the devs')
    }
  }
  if(message.content.startsWith(`${p}purge`)) {
    if(!message.member.hasPermission("ADMINISTRATOR")) message.channel.send("You do not have the proper permissions. Do you think ur smart? jkjk just don't do it again :smile:");
    if(message.member.hasPermission("ADMINISTRATOR")) {
      if(!args[0]) message.channel.send("Ummm, you didn't state an amount... Please try again but put in a number this time!");
      if(args[0] > 100) message.channel.send(`You can't purge more than 100 messages at once.`);
      if(args[0] <= 100) {
        message.channel.bulkDelete(args[0]).then(() => {
          message.channel.send(`Deleted ${args[0]} messages.`).then(msg => msg.delete(5000));
        })
      }
    }
  }
  if(message.content.startsWith(`${p}support`)) {
    let si = new Discord.MessageEmbed()
    .setTitle(`Come join our official server ${message.author.username}!`)
    .setColor('RANDOM')
    .setDescription(`https://discord.gg/PGDFpNT`);
    message.channel.send(si);
  }
  if(message.content.startsWith(`${p}setup`)) {
    if(!message.member.hasPermission("ADMINISTRATOR")) message.channel.send("HEY! You can't enter here, its an admin secret :shushing_face:");
    if(message.member.hasPermission("ADMINISTRATOR")) {
      message.delete();
      let setup = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Hey ${message.author.username}, let's get your server set up!`)
      .setDescription("These instructions are so you can use this bot to the fullest capacity. This bot is not only commands :wink:")
      .addField(`Make a member-log channel, with permissions set to everyone read only except for admin and the bot:`, `This is for greetings when members join and leave the server`)
      .addField(`Make a reports channel, with permissions set so that only you and the bot can type, but everyone can read:`, `This is for when somebody does something bad and someone wants to report it`)
      .addField(`Make a commands channel, where everyone can type, optionally with slow mode enabled:`, `Do this to ensure that commands don't mess with the focus of the rest of your server`)
      .addField(`Make a mod-logs channel, with permissions set so that only you and the bot can type, but everyone can read:`, ` This is so that you can properly use the kick and bans command and make it easier for admin and mods to see.`)
      message.author.send(setup)
      message.channel.send(`There you go ${message.author.username}, I sent you the message privately!`)
    }
  }
  if(message.content.startsWith(`${p}dice`)) {
    let d = [`1`, `2`, `3`, `4`, `5`, `6`];
    let dice = d[Math.floor(Math.random() * 6) + 1]
    message.channel.send(`You got a ${dice}!`)
  }
  if(message.content.startsWith(`${p}nick`)) {
    if(args.join(" ").split("").length > 32) return message.channel.send("Your nickname can't be more than 32 characters!")
    let wait = await message.channel.send("Changing nickname...");
    let nick = args.join(" ");
    if(!args[0]) return message.channel.send(`You didn't specify a nickname!`)
    await message.member.setNickname(nick).then(() => wait.delete());
    message.channel.send(`Your nickname has been set to ${nick}!`)
  }
  if(message.content.startsWith(`${p}comingsoon`)) {
    message.delete();
    let soon = new Discord.MessageEmbed()
    .setTitle(`Hmmmmm, so you want to know what comes next?`)
    .setDescription(`New commands in the works!`)
    .setColor(`RANDOM`)
    .addField(`Bug fixes:`, `Fixing the mute command, cuz it got f*cked up in djs v12`)
    .addField(`New command:`, `~advice and ~suggestions coming soon`)
    message.author.send(soon)
    message.channel.send(`Check your DMs, I sent you the upcoming updates.`)
  }
  if(message.content.startsWith(`${p}math`)) {
    let equ = args.join(" ")
    if(!equ) return message.channel.send("You didn't add any math!");
    let embed = new Discord.MessageEmbed()
    .setTitle("Math")
    .setAuthor('Frontier Fun-', message.author.avatarURL)
    .addField("Input", `\`\`\`${equ}\`\`\``)
    .addField("Output" ,`\`\`\`${math.evaluate(equ)}\`\`\``);
    message.channel.send(embed).catch(e => console.log(e));
  }
  if(message.content.startsWith(`${p}meme`)) {
    if(!message.channel.nsfw) return message.channel.send("Please go into a NSFW Channel to use this command!");
    let msg = await message.channel.send(`Generating meme...`)
    let reddit = [`dankmemes`, `memes`, `MemeEconomy`, `PrequelMemes`, `ComedyCemetary`];
    let subreddit = reddit[Math.floor(Math.random() * reddit.length -1)];
    const img = await randomPuppy(subreddit);
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setImage(`${img}`)
    .setTitle(`From /r/${subreddit}`)
    .setURL(`https://reddit.com/r/${subreddit}`);
    message.channel.send(embed);
    msg.delete();
  }
  if(message.content.startsWith(`${p}triggered`)) {
    let msg = await message.channel.send(`Generating...`);
    let tar = message.mentions.users.first();
    let user = tar;
    if (!tar) tar = message.author
    let profilepic = tar.displayAvatarURL({ format: `png` });
    let url = `https://eclyssia-api.tk/api/v1/triggered?url=${profilepic}`;
    console.log(url);
    console.log(profilepic)
    
    fetch(url, {
      headers: {

      }
  }).then(async res => {
      await message.channel.send({
         files: [{
             attachment: res.body,
             name: `${tar.tag}-triggered.gif`
         }]
      }).then(() => msg.delete());
  }).catch(err => console.error(err));

 }


})

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if(!channel) return;
  channel.send(`Welcome to the server, ${member}!`);
 })
 client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if(!channel) return;
  channel.send(`Goodbye, ${member}, we're gonna miss ya...`);
 })

 client.login(config.token);
