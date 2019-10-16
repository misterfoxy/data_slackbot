/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const { SlackDialog } = require('botbuilder-adapter-slack');
const axios = require('axios');
const {insertNewIssue} = require('../db/actions')

module.exports = function(controller) {

    controller.ready(async () => {
        if (process.env.MYTEAM) {
            let bot = await controller.spawn(process.env.MYTEAM);
            await bot.startConversationInChannel(process.env.MYCHAN,process.env.MYUSER);
            bot.say('I AM AWOKEN.');
        }
    });

    controller.on('direct_message', async(bot, message) => {
        // let dialog = new SlackDialog('My Dialog', 'callback_123', 'Save');
        // dialog.addText('Your full name', 'name').addEmail('Your email', 'email');
        // dialog.notifyOnCancel(true);
        // await bot.replyWithDialog(message, dialog.asObject());
        await bot.reply(message,'I heard a private message');
    });

    // controller.hears('dm me', 'message', async(bot, message) => {
    //     await bot.startPrivateConversation(message.user);
    //     await bot.say(`Let's talk in private.`);
    // });

    // controller.on('direct_mention', async(bot, message) => {
    //     await bot.reply(message, `I heard a direct mention that said "${ message.text }"`);
    // });

    // controller.on('mention', async(bot, message) => {
    //     await bot.reply(message, `You mentioned me when you said "${ message.text }"`);
    // });

    controller.hears('ephemeral', 'message,direct_message', async(bot, message) => {
        await bot.replyEphemeral(message,'This is an ephemeral reply sent using bot.replyEphemeral()!');
    });

    controller.hears('threaded', 'message,direct_message', async(bot, message) => {
        await bot.replyInThread(message,'This is a reply in a thread!');

        await bot.startConversationInThread(message.channel, message.user, message.incoming_message.channelData.ts);
        await bot.say('And this should also be in that thread!');
    });

    // controller.hears('blocks', 'message', async(bot, message) => {

    //     await bot.reply(message,{
    //         blocks: [
    //             {
    //                 "type": "section",
    //                 "text": {
    //                     "type": "mrkdwn",
    //                     "text": "Hello, Assistant to the Regional Manager Dwight! *Michael Scott* wants to know where you'd like to take the Paper Company investors to dinner tonight.\n\n *Please select a restaurant:*"
    //                 }
    //             },
    //             {
    //                 "type": "divider"
    //             },
    //             {
    //                 "type": "section",
    //                 "text": {
    //                     "type": "mrkdwn",
    //                     "text": "*Farmhouse Thai Cuisine*\n:star::star::star::star: 1528 reviews\n They do have some vegan options, like the roti and curry, plus they have a ton of salad stuff and noodles can be ordered without meat!! They have something for everyone here"
    //                 },
    //                 "accessory": {
    //                     "type": "image",
    //                     "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
    //                     "alt_text": "alt text for image"
    //                 }
    //             },
    //             {
    //                 "type": "section",
    //                 "text": {
    //                     "type": "mrkdwn",
    //                     "text": "*Kin Khao*\n:star::star::star::star: 1638 reviews\n The sticky rice also goes wonderfully with the caramelized pork belly, which is absolutely melt-in-your-mouth and so soft."
    //                 },
    //                 "accessory": {
    //                     "type": "image",
    //                     "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/korel-1YjNtFtJlMTaC26A/o.jpg",
    //                     "alt_text": "alt text for image"
    //                 }
    //             },
    //             {
    //                 "type": "section",
    //                 "text": {
    //                     "type": "mrkdwn",
    //                     "text": "*Ler Ros*\n:star::star::star::star: 2082 reviews\n I would really recommend the  Yum Koh Moo Yang - Spicy lime dressing and roasted quick marinated pork shoulder, basil leaves, chili & rice powder."
    //                 },
    //                 "accessory": {
    //                     "type": "image",
    //                     "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/DawwNigKJ2ckPeDeDM7jAg/o.jpg",
    //                     "alt_text": "alt text for image"
    //                 }
    //             },
    //             {
    //                 "type": "divider"
    //             },
    //             {
    //                 "type": "actions",
    //                 "elements": [
    //                     {
    //                         "type": "button",
    //                         "text": {
    //                             "type": "plain_text",
    //                             "text": "Farmhouse",
    //                             "emoji": true
    //                         },
    //                         "value": "Farmhouse"
    //                     },
    //                     {
    //                         "type": "button",
    //                         "text": {
    //                             "type": "plain_text",
    //                             "text": "Kin Khao",
    //                             "emoji": true
    //                         },
    //                         "value": "Kin Khao"
    //                     },
    //                     {
    //                         "type": "button",
    //                         "text": {
    //                             "type": "plain_text",
    //                             "text": "Ler Ros",
    //                             "emoji": true
    //                         },
    //                         "value": "Ler Ros"
    //                     }
    //                 ]
    //             }
    //         ]
    //     });

    // });

    // controller.on('block_actions', async (bot, message) => {
    //     await bot.reply(message, `Sounds like your choice is ${ message.incoming_message.channelData.actions[0].value }`)
    // });

    controller.on('slash_command', async(bot, message) => {
        let dialog = new SlackDialog('New TA Issue', 'callback_123', 'Save');
        dialog
          .addText('Lesson number', 'name')
          .addEmail('Issue description', 'description');
        
        dialog.notifyOnCancel(true);

        await bot.replyWithDialog(message, dialog.asObject());
        // set http status
        // bot.httpBody({text:'You can send an immediate response using bot.httpBody()'});

    });

    // controller.on('interactive_message', async (bot, message) => {

    //     console.log('INTERACTIVE MESSAGE', message);

    //     switch(message.actions[0].name) {
    //         case 'replace':
    //             await bot.replyInteractive(message,'[ A previous message was successfully replaced with this less exciting one. ]');
    //             break;
    //         case 'dialog':
    //             await bot.replyWithDialog(message, new SlackDialog('this is a dialog', '123', 'Submit', [
    //                 {
    //                     type: 'text',
    //                     label: 'Field 1',
    //                     name: 'field1',
    //                 },
    //                 {
    //                     type: 'text',
    //                     label: 'Field 2',
    //                     name: 'field2',
    //                 }
    //             ]).notifyOnCancel(true).state('foo').asObject());
    //             break;
    //         default:
    //             await bot.reply(message, 'Got a button click!');
    //     }
    // });

    controller.on('dialog_submission', async (bot, message) => {
        let usersn = message.incoming_message.channelData.user.name;
        let lesson = message.submission.name;
        let description = message.submission.description;
        insertNewIssue(message.user, lesson, description, Date.now())
        .then(data => {
     
            const messageText = `*Lesson:* ${lesson}\n*Description:* ${description}\n*User:* ${usersn}`

            axios.post(`https://slack.com/api/chat.postMessage?token=${bot.api._accessToken}&channel=${process.env.REMOTE_SUPPORT_ID}&text=${messageText}&icon_emoji=:bar_chart:`)
            .then(async(data) => {
                const message_id = data.data.ts
                const channel = data.data.channel
    
                const res = await axios.get(`https://slack.com/api/users.info?token=${bot.api._accessToken}&user=${message.user}`)
                const user = res.data.user.real_name;
                // grab permalink of the post
                const response = await axios.get(`https://slack.com/api/chat.getPermalink?token=${bot.api._accessToken}&channel=${channel}&message_ts=${message_id}`);
                const permalink = response.data.permalink;
                axios.post(process.env.TA_QUEUE_WEBHOOK, {
                    blocks:[
                        {
                            "type": "section",
                            "text": {
                                "text": `:bulb: <${permalink}|New Issue in Remote Support!>:bulb:\n*Lesson: ${lesson}*\n*Posted by ${user}* `,
                                "type": "mrkdwn"
                            }
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "context",
                            "elements": [
                                {
                                    "type": "mrkdwn",
                                    "text": `Description: ${description}`
                                }
                            ]
                        }
                    ]
                })
                .then(data => {
                    bot.replyPrivate(message, 'Success')
                })
                .catch(err => {
                    bot.replyPrivate(message, `Err: ${err}`)
                })
            })
            .catch(err => {
                bot.replyPrivate(message, `Remote Support Post Err: ${err}`)
            })
        })
        .catch(err => {
            bot.replyPrivate(message, `db submission ${err}`);
        })
    });

    // controller.on('dialog_cancellation', async (bot, message) => {
    //     await bot.replyPrivate(message, 'dialog cancelled');
    // });
}