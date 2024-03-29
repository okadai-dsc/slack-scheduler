import { generateIcs } from './utils/generateIcs';
import { CreateEventModal } from './views/CreateEventModal';
import { ScheduleNotifyBlocks } from './views/ScheduleNotifyBlocks';
import { App } from '@slack/bolt';
import config from 'config';
import { format } from 'date-fns';
import * as dotenv from 'dotenv';
import http from 'http';
import JSXSlack from 'jsx-slack';
import { AddressInfo } from 'net';

dotenv.config();

const app = new App({
  token: process.env.SLACK_TOKEN || config.get('slack.token'),
  signingSecret: process.env.SLACK_SECRET || config.get('slack.signingSecret'),
});

// uptime 用サーバー
const server = http.createServer();

// 「予定を作成」ショートカットが実行された
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

// 型がないためコンパイルエラー回避
interface SelectDateTimeValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;
}

// 「予定を作成」モーダルが送信された
app.view('create_event_modal', async ({ ack, view, client, logger, body }) => {
  await ack();

  // valueを取得
  const values = view.state.values;
  const title = values['title']['title'].value as string;
  const description = values['description']['description'].value as string;
  const location = values['location']['location'].value;
  const meetingUrl = values['meetingUrl']['meetingUrl'].value;
  const startDateTime = (
    values['startDateTime']['startDateTime'] as SelectDateTimeValue
  ).selected_date_time as number;
  const duration = Number(
    values['duration']['duration'].selected_option?.value as string,
  );
  const shareWith = values['shareWith']['shareWith']
    .selected_conversations as string[];

  // プロフィールの取得
  const profile = await client.users.profile.get({
    user: body.user.id,
    token: process.env.SLACK_TOKEN || config.get('slack.token'),
  });

  const ics = await generateIcs(
    startDateTime,
    duration,
    title,
    description,
    location ? location : undefined,
    meetingUrl ? meetingUrl.split(',').filter((v) => v != '')[0] : undefined,
  );

  const file = await client.files.upload({
    channels: process.env.FILE_CHANNEL_ID || config.get('slack.fileChannelID'),
    filename: `${format(Date.now(), 'yyyyMMddHHmmssSSS')}-${title}.ics`,
    filetype: 'ics',
    content: ics,
  });

  await Promise.all(
    shareWith.map(async (id) => {
      await client.chat.postMessage({
        username: profile.profile?.display_name || profile.profile?.first_name,
        icon_url: profile.profile?.image_192,
        channel: id,
        text: ' ',
        blocks: JSXSlack(
          ScheduleNotifyBlocks({
            title: title,
            description: description,
            location: location ? location : null,
            meetingUrls: meetingUrl
              ? meetingUrl.split(',').filter((v) => v != '')
              : [],
            startDateTime: startDateTime,
            duration: duration,
            author: body.user.id,
            icsUrl: file.file?.permalink
              ? file.file?.permalink
              : 'http://undefined.com',
          }),
        ),
      });
    }),
  );
  console.log(description);
});

server.on('request', function (req, res) {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.end('HTTP: OK');
  }
});

// Start your app
(async () => {
  const appServer = await app.start(process.env.PORT || 3000);

  server.listen(8080, () => {
    console.log('⚡️ Keep-Alive server is running!');
  });

  console.log(
    `⚡️ Bolt app is running! Server port: ${
      (appServer.address() as AddressInfo).port
    }`,
  );
})();
