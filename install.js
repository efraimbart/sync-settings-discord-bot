import { DiscordRequest } from './utils.js';
import { SETTING_COMMAND } from './commands.js';
  
// API endpoint to get and post guild commands
const endpoint = `applications/${process.env.APP_ID}/commands`;
// install command
try {
    await DiscordRequest(endpoint, { method: 'POST', body: SETTING_COMMAND });
} catch (err) {
    console.error(err);
}