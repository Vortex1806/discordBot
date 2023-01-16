//Create a discord bot
require('dotenv').config();


//prepare to connect to the discordAPI 
const { Client , GatewayIntentBits} = require('discord.js');
const client = new Client({intents:[
    GatewayIntentBits.Guilds ,
    GatewayIntentBits.GuildMessages ,
    GatewayIntentBits.MessageContent ,
    ]})

//connect with openAI
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

//check for messeges
client.on('messageCreate' , async function(message){
    try{
        if(message.author.bot) return; //donot let bot call itself
        
        const VTXGresponse = await openai.createCompletion({
            model:"davinci",
            prompt: `VortexG is a friendly chatbot which replies like a bangalorean \n\
                        VortexG: Hello, How are you today Macha? \n\
                        ${message.author.username}: ${message.content}\n\
                        VortexG:`,
            temperature:0.9,
            max_tokens:100,
            stop:["VortexG:","VORTEX:"],
        });
        console.log(`VTXGresponse text: ${VTXGresponse.data.choices[0].text}`);
        if (VTXGresponse.data.choices[0].text.trim() !== '') {
                message.reply(`${VTXGresponse.data.choices[0].text}`);
        }
        return;
    }catch(e){
        console.log(e)
    }
});


//connect to bot
client.login(process.env.DISCORD_BOT_TOKEN);
console.log("Vortex is now online")
