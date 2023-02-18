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

export const LocationTypes = {
  Location: 'location',
  Zoom: 'zoom',
  Skype: 'skype',
  Teams: 'teams',
} as const;

export type LocationType = (typeof LocationTypes)[keyof typeof LocationTypes];

type ScheduleNotifyProps = {
  title: string;
  description: string;
  location: string;
  locationType: LocationType;
  startDateTime: number;
  duration: number;
  author: string;
};

const locationSection = (type: LocationType, location: string) => {
  switch (type) {
    case LocationTypes.Location:
      return (
        <Section>
          <b>📍 場所</b> <br />
          {location}
        </Section>
      );
    case LocationTypes.Zoom:
      return (
        <Section>
          <b>🎦 Zoom 開催</b> <br />
          <a href={location}>{location}</a>
        </Section>
      );
    case LocationTypes.Skype:
      return (
        <Section>
          <b>☁️ Skype 開催</b> <br />
          <a href={location}>{location}</a>
        </Section>
      );
    case LocationTypes.Teams:
      return (
        <Section>
          <b>🙍‍♀️ Teams 開催</b> <br />
          <a href={location}>{location}</a>
        </Section>
      );
  }
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
    {locationSection(props.locationType, props.location)}
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
    <Divider />
    <Actions>
      <Button>✨カレンダーに追加</Button>
    </Actions>
  </Blocks>
);
