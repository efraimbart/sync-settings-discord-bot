import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';
import {
  SETTING_COMMAND,
  HasGuildCommands,
} from './commands.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "setting" guild command
    if (name === 'setting') {
      const setting = req.body.data.options[0].value
      const regex = /\[(.*)\]\(sync-settings:\/\/(.*)\)/
      const results = setting.match(regex)
      if (results) {
        var title = results[1]
        var url = results[2]
      } else if (setting.startsWith('sync-settings://')) {
        title = setting
        url = setting.replace('sync-settings://', '')
      } else {
        return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [{
            title: title, //`sync-settings://${setting}`,
            url: `${process.env.BASE_URL}setting/${url}`,
            type: 'link'
          }]
        },
      });
      }
      
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [{
            title: title, //`sync-settings://${setting}`,
            url: `${process.env.BASE_URL}setting/${url}`,
            type: 'link'
          }]
        },
      });
    }
  }
});

app.get('/setting/:setting', async function (req, res) {
  return res.redirect(301, `sync-settings://${req.params.setting}`)
})

app.listen(PORT, () => {
  console.log('Listening on port', PORT);

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    SETTING_COMMAND
  ]);
});