import { dateToString } from '@/utils/dateToString';
import {
  Actions,
  Blocks,
  Button,
  Context,
  Divider,
  Header,
  Mrkdwn,
  Section,
} from 'jsx-slack';

type ScheduleNotifyProps = {
  title: string;
  description: string;
  location: string;
  startDateTime: number;
  duration: number;
  author: string;
};

export const ScheduleNotifyBlocks = (props: ScheduleNotifyProps) => (
  <Blocks>
    <Header>
      <b>⚡{props.title}</b>
    </Header>
    <Divider />
    <Section>
      <Mrkdwn raw verbatim>
        {'📆*日時* \n ' + dateToString(props.startDateTime, props.duration)}
      </Mrkdwn>
    </Section>
    <Section>
      📍<b>場所</b>
      <br />
      {props.location}
    </Section>
    <Section>
      <Mrkdwn raw verbatim>
        {'📝*内容* \n' + props.description}
      </Mrkdwn>
    </Section>
    <Context>
      <Mrkdwn raw verbatim>
        Scheduled by {`<@${props.author}>`}
      </Mrkdwn>
    </Context>
    <Divider />
    <Actions>
      <Button>✨カレンダーに追加</Button>
    </Actions>
  </Blocks>
);
