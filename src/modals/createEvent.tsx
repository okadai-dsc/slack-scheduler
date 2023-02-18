import config from 'config';
import {
  ConversationsSelect,
  DateTimePicker,
  Input,
  Modal,
  Option,
  Select,
  Textarea,
} from 'jsx-slack';

export const CreateEventModal = () => (
  <Modal title='予定を作成' submit='作成' close='キャンセル'>
    <Input type='text' name='title' label='タイトル' required />
    <Textarea
      name='description'
      label='説明'
      required
      placeholder='予定についてもう少し詳しく説明してください。マークダウン記法が使用可能です！'
      maxLength={500}
    />

    <Input
      type='text'
      name='location'
      label='場所'
      required
      placeholder='場所、またはZoomリンクを入力してください'
      maxLength={100}
    />

    <DateTimePicker
      name='startDateTime'
      label='開始日時'
      required
      initialDateTime={Date.now()}
    />

    <Select name='duration' label='期間' value='60' required>
      <Option value='15'>15 分</Option>
      <Option value='30'>30 分</Option>
      <Option value='45'>45 分</Option>
      {[...new Array(12).keys()].map((v) => {
        return <Option value={`${(v + 1) * 60}`}>{v + 1} 時間</Option>;
      })}
    </Select>

    <ConversationsSelect
      name='shareWith'
      label='共有先'
      placeholder='予定を送信する先を選択してください'
      required
      multiple
      include={['public', 'im', 'mpim']}
      initialConversation={[config.get('slack.notifyChannelID'), 'current']}
      excludeBotUsers
    />
  </Modal>
);
