 const Telegraf = require('telegraf')
 const express = require('express')
 const dotenv = require('dotenv')
 const bodyParser = require('body-parser')


 dotenv.config();

 // Read Bot Token From Env
 const bot = new Telegraf(process.env.BOT_TOKEN)

 // Set telegram webhook
 bot.telegram.setWebhook(`${process.env.URL}:${process.env.PORT}/${process.env.BOT_TOKEN}`)

 const app = express()

 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({
     extended: true

 }));

 // parse application/json
 app.use(bodyParser.json())

 app.get('/', (req, res) => {
     // Set Webhooks here
     bot.telegram.setWebhook(`/${process.env.BOT_TOKEN}`).catch((error) => {
         res.json({
             "status": false,
             "message": "Promiss error"
         });
     });

     bot.telegram.sendMessage(process.env.CHAT_ID, "Bot has been started").catch((error) => {
         res.json({
             "status": false,
             "message": "Promiss error"
         });
     });

     res.json({
         "status": true,
         "message": "Bot is running"
     });
 })



 app.get("/stop", (req, res, next) => {
     // Delete Webhooks here
     bot.telegram.sendMessage(process.env.CHAT_ID, "Bot has been stopped").catch((error) => {
         res.json({
             "status": false,
             "message": "Promiss error"
         });
     });

     bot.telegram.deleteWebhook().catch((error) => {
         res.json({
             "status": false,
             "message": "Promiss error"
         });
     });

     res.json({
         "status": true,
         "message": "Bot is stopped"
     });
 });

 app.options('/contact', function (req, res) {
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader('Access-Control-Allow-Methods', '*');
     res.setHeader("Access-Control-Allow-Headers", "*");
     res.end();
 });

 app.post("/contact", (req, res, next) => {

     message = `From : ${req.body.from} \nName : ${req.body.name} \nE-mail : ${req.body.email}\nMessage : ${req.body.message}`

     // Delete Webhooks here
     bot.telegram.sendMessage(process.env.CHAT_ID, message).catch((error) => {
         res.json({
             "status": false,
             "message": "Something went wrong... Try to connect with me on any social platefrom"
         });
     });

     res.json({
         "status": true,
         "message": "Message has be sent successfully..."
     });
 });


 // Set the bot API endpoint
 app.use(bot.webhookCallback(`/${process.env.BOT_TOKEN}`))

 app.listen(process.env.PORT, () => {
     console.log(`Example app listening on port ${process.env.PORT}!`)
 })
