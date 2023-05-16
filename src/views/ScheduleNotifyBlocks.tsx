import { dateToString } from '@/utils/dateToString';
import {
  Actions,
  Blocks,
  Button,
  Divider,
  Header,
  Mrkdwn,
  Section,
} from 'jsx-slack';

type ScheduleNotifyProps = {
  /** タイトル */
  title: string;

  /** 予定の詳細 */
  description: string;

  /** 開催場所 */
  location: string | null;

  /** オンラインミーティングURL */
  meetingUrls: string[];

  /** 開始時刻 */
  startDateTime: number;

  /** 開催期間(分) */
  duration: number;

  /** 予定の作成者 */
  author: string;

  /** icsファイルのダウンロードURL */
  icsUrl: string;
};

const meetingSection = (urls: string[]) => {
  if (urls.length < 0) return null;
  return urls.map((url) => {
    if (url.match('https://.*zoom.us/j') != null) {
      // zoom
      return (
        <Section>
          <b>🎦 Zoom</b> <br />
          <a href={url}>会議に参加</a>
        </Section>
      );
    } else if (url.match('https://.*zoom.us/skype')) {
      // skype
      return (
        <Section>
          <b>☁️ Skype</b> <br />
          <a href={url}>会議に参加</a>
        </Section>
      );
    } else if (url.match('https://teams.microsoft.com/')) {
      // microsoft teams
      return (
        <Section>
          <b>🙍‍♀️ Teams</b> <br />
          <a href={url}>会議に参加</a>
        </Section>
      );
    } else {
      return (
        <Section>
          <b>💻 オンラインミーティング</b> <br />
          <Button url={url}>会議に参加</Button>
        </Section>
      );
    }
  });
};

export const ScheduleNotifyBlocks = (props: ScheduleNotifyProps) => (
  <Blocks>
    <Header>
      <b>⚡{props.title}</b>
    </Header>
    <Divider />
    <Section>
      <Mrkdwn raw verbatim>
        {'📆 *日時* \n' + dateToString(props.startDateTime, props.duration)}
      </Mrkdwn>
    </Section>
    {props.location ? (
      <Section>
        <b>📍 場所</b> <br />
        <p>{props.location}</p>
      </Section>
    ) : null}
    {meetingSection(props.meetingUrls)}
    <Section>
      <Mrkdwn raw verbatim>
        {'📝 *内容* \n' + props.description}
      </Mrkdwn>
    </Section>
    {/* <Context>
      <Mrkdwn raw verbatim>
        by {`<@${props.author}>`}
      </Mrkdwn>
    </Context> */}
    <Actions>
      <Button url={props.icsUrl}>✨カレンダーに追加</Button>
    </Actions>
    <Divider />
  </Blocks>
);
