import { CreateEventModal } from './modals/createEvent';
import { App } from '@slack/bolt';
import config from 'config';
import JSXSlack from 'jsx-slack';
import { AddressInfo } from 'net';

const app = new App({
  token: config.get('slack.token'),
  signingSecret: config.get('slack.signingSecret'),
});

app.shortcut('create_event', async ({ shortcut, ack, context }) => {
  ack();

  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: shortcut.trigger_id,
      view: JSXSlack(CreateEventModal()),
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

// Start your app
(async () => {
  const server = await app.start(process.env.PORT || 3000);

  console.log(
    `⚡️ Bolt app is running! Server port: ${
      (server.address() as AddressInfo).port
    }`,
  );
})();
