import { Application } from 'probot'
import { push } from './push';

export = (app: Application) => {
  app.on('push', push);

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
