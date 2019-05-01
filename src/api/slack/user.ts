import { WebClient } from '@slack/web-api';
import { SLACK_TOKEN } from '../../env';

export interface ISlackUser {
    id: string;
    realName: string;
    name: string;
}

export const getUserList = async (): Promise<ISlackUser> => {
    const web = new WebClient(SLACK_TOKEN);
    const result = await web.users.list();
    const members: any = result.members as any;
    return members.map(member => ({
        id: member.id,
        realName: member.real_name,
        name: member.name
    }));
}