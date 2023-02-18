import { CreateEventModal } from './views/CreateEventModal';
import { ScheduleNotifyBlocks } from './views/ScheduleNotifyBlocks';
import { App } from '@slack/bolt';
import config from 'config';
import * as dotenv from 'dotenv';
import JSXSlack from 'jsx-slack';
import { AddressInfo } from 'net';

dotenv.config();

const app = new App({
  token: process.env.SLACK_TOKEN || config.get('slack.token'),
  signingSecret: process.env.SLACK_SECRET || config.get('slack.signingSecret'),
});

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

  if (location && location.includes('部室')) {
    // 部室
  }

  // プロフィールの取得
  const profile = await client.users.profile.get({
    user: body.user.id,
    token: process.env.SLACK_TOKEN || config.get('slack.token'),
  });

  // 予定を送信
  shareWith.forEach((id) => {
    return client.chat.postMessage({
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
        }),
      ),
    });
  });
  console.log(description);
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
