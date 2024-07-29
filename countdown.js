const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
require('dotenv').config(); // Load environment variables

// Retrieve environment variables from .env file
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Check if the token is loaded correctly
if (!BOT_TOKEN) {
    process.exit(1); // Exit the script with an error code
}

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Bosses data from the image, including actual Imgur URLs and relevant thumbnails
const bosses = [
    { date: '05-Aug', boss: 'Nex', img: 'https://imgur.com/oI2EwVf.gif', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Nex.png/800px-Nex.png?2a1b3' },
    { date: '06-Aug', boss: 'Phantom Muspah', img: 'https://imgur.com/UBrGYYs.jpeg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Phantom_Muspah_%28shielded%29.png/1024px-Phantom_Muspah_%28shielded%29.png?9cf6a' },
    { date: '07-Aug', boss: 'Duke Succelus', img: 'https://imgur.com/qs8xIwO.jpeg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Duke_Sucellus.png/800px-Duke_Sucellus.png?d588a' },
    { date: '08-Aug', boss: 'Hallowed Sepulchre', img: 'https://imgur.com/r4xdbKK.png', thumbnail: 'https://oldschool.runescape.wiki/images/Grand_Hallowed_Coffin_%28looted%29.png?a4b5c' },
    { date: '09-Aug', boss: 'Vorkath', img: 'https://imgur.com/5WbWxd3.png', thumbnail: 'https://oldschool.runescape.wiki/images/Vorkath.png?1ce3f' },
    { date: '10-Aug', boss: 'The Nightmare (5man)', img: 'https://imgur.com/HB8rkCs.png', thumbnail: 'https://oldschool.runescape.wiki/images/The_Nightmare.png?0128a' },
    { date: '11-Aug', boss: 'Fortis Colosseum', img: 'https://imgur.com/sep641u.jpeg', thumbnail: 'https://oldschool.runescape.wiki/images/Sol_Heredit.png?91250' },
    { date: '12-Aug', boss: 'Phosani\'s Nightmare', img: 'https://imgur.com/MxRy95I.jpg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Phosani%27s_Nightmare_Display.png/1024px-Phosani%27s_Nightmare_Display.png?fd6b8' },
    { date: '13-Aug', boss: 'Zulrah', img: 'https://imgur.com/RcrRs5T.jpg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Zulrah_%28tanzanite%29.png/800px-Zulrah_%28tanzanite%29.png?fd984' },
    { date: '14-Aug', boss: 'Vardorvis', img: 'https://imgur.com/s84sZmt.jpg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Vardorvis.png/800px-Vardorvis.png?48af8' },
    { date: '15-Aug', boss: 'The Leviathan', img: 'https://imgur.com/o34k0UI.png', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/The_Leviathan.png/800px-The_Leviathan.png?d588a' },
    { date: '16-Aug', boss: 'Alchemical Hydra', img: 'https://imgur.com/zcaLXkI.jpg', thumbnail: 'https://oldschool.runescape.wiki/images/Alchemical_Hydra_%28serpentine%29.png' },
    { date: '17-Aug', boss: 'Theatre of Blood (5man)', img: 'https://imgur.com/ul2R2UN.jpg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Verzik_Vitur_%28final_form%29.png/1024px-Verzik_Vitur_%28final_form%29.png?f9733' },
    { date: '18-Aug', boss: 'Tombs of Amascut Expert (solo)', img: 'https://imgur.com/Xuoec1C.png', thumbnail: 'https://oldschool.runescape.wiki/images/Tumeken%27s_Warden_%28level-544%29.png?7db9d' },
    { date: '19-Aug', boss: 'Corrupted Gauntlet', img: 'https://imgur.com/aUWX1wK.jpg', thumbnail: 'https://oldschool.runescape.wiki/images/Corrupted_Hunllef.png?0cd55' },
    { date: '20-Aug', boss: 'Tempoross', img: 'https://imgur.com/LggamDu.png', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Tempoross.png/1280px-Tempoross.png?12042' },
    { date: '21-Aug', boss: 'The Whisperer', img: 'https://imgur.com/91Zgv5Y.png', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Wisp_%28follower%29.png/320px-Wisp_%28follower%29.png?d6646' },
    { date: '22-Aug', boss: 'TzTok-Jad', img: 'https://imgur.com/7e6WaUC.jpg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/TzTok-Jad.png/800px-TzTok-Jad.png?87507' },
    { date: '23-Aug', boss: 'Grotesque Guardians', img: 'https://imgur.com/w1SMFlU.jpeg', thumbnail: 'https://oldschool.runescape.wiki/images/thumb/Dusk_%282nd_form%29.png/800px-Dusk_%282nd_form%29.png?d4047' },
    { date: '24-Aug', boss: 'Chambers of Xeric (3man)', img: 'https://imgur.com/UDAuPoG.jpeg', thumbnail: 'https://oldschool.runescape.wiki/images/Great_Olm.png?f1081' }
];

// List of skills for generating password
const skills = [
    'Taming', 'Shamanism', 'Warding', 'Artisan', 'Sailing', 'Attack', 'Strength', 'Defence', 'Ranged',
    'Prayer', 'Magic', 'Runecrafting', 'Construction', 'Hitpoints', 'Agility', 'Herblore', 'Thieving',
    'Crafting', 'Fletching', 'Slayer', 'Hunter', 'Mining', 'Smithing', 'Fishing', 'Cooking', 'Firemaking',
    'Woodcutting', 'Farming'
];

// Function to generate a random word from the list
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * skills.length);
    return skills[randomIndex];
}

// Function to generate a random 3-digit code
function getRandomCode() {
    return Math.floor(100 + Math.random() * 900);
}

// Function to generate the task-specific password
function generatePassword() {
    const randomWord = getRandomWord();
    const randomCode = getRandomCode();
    return `${randomWord}${randomCode}`;
}

// Function to post the countdown message
async function postCountdownMessage(daysToGo, boss) {
    const channel = client.channels.cache.get('1144337989581938830');
    if (!channel) {
        console.log('Channel not found.');
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle(`Countdown to Green Bandits 20th Birthday!`)
        .setDescription(`**${daysToGo} days to go!**`)
        .addFields(
            { name: '**🎯 Boss of the Day**', value: `*${boss.boss}*` },
            { name: '**📅 Date**', value: `*${boss.date}*` },
            { name: '**🏆 Rewards**', value: `**Best PB:** 25m GP\n**Most KC (any team size):** 25m GP` },
            { name: '**🔑 Password**', value: generatePassword() },
            { name: '**📸 Password Rules**', value: `*The password must be shown in PB screenshots. KCs can be in any team size and must show before/after KCs, each with the password.*` }
        )
        .setImage(boss.img)
        .setThumbnail(boss.thumbnail);

    await channel.send({ embeds: [embed] });
    console.log(`Posted countdown message for ${daysToGo} days to go`);
}

// Event handler for when the bot is ready
client.once('ready', async () => {
    console.log('Bot is ready!');

    // Define the start date and time (10 PM UK time on July 29, 2024)
    const startDate = new Date('2024-07-29T20:40:00Z'); // 10 PM UK time in UTC

    // Schedule the countdown messages
    bosses.forEach((boss, index) => {
        // Calculate the scheduled date for each boss event, 24 hours apart
        const jobDate = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000);
        
        // Calculate the number of days remaining until the event
        const daysToGo = bosses.length - index;

        // Schedule the job
        schedule.scheduleJob(jobDate, () => {
            postCountdownMessage(daysToGo, boss);
        });
    });
});

// Log in to Discord using the bot token
client.login(BOT_TOKEN);
