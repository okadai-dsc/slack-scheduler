import { App } from '@slack/bolt';
import config from 'config';
import { AddressInfo } from 'net';

const app = new App({
  token: config.get('token'),
  signingSecret: config.get('signingSecret'),
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
