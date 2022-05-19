import { DiscordRequest } from './utils.js';
import { SETTING_COMMAND } from './commands.js';
  
// API endpoint to get and post guild commands
const endpoint = `applications/${appId}/commands`;
// install command
try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
} catch (err) {
    console.error(err);
}