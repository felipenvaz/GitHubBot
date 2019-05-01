import { sendMessage } from './api/slack/message';
import { getChatList } from './api/slack/chat';

sendMessage({
    channel: 'dev', //'G3TUQCWF6',
    text: `YOLO. Also, don't talk to me`
});

// getChatList();