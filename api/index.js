import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest } from '../utils.js';

// Create an express app
const app = express();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/api/interactions', async function (req, res) {
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
            content: 'Invalid setting link',
            flags: 64
          },
        });
      }
      
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [{
            title: title, //`sync-settings://${setting}`,
            url: `${process.env.BASE_URL}api/setting/${url}`,
            type: 'link'
          }]
        },
      });
    }
  }
});

app.get('/api/setting/:setting', async function (req, res) {
  return res.redirect(301, `sync-settings://${req.params.setting}`)
})

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});