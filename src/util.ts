import { EBranch, BOT } from './constants';

const BRANCH_REGEX = /refs\/heads\/(.*)/;
export const getBranchType = (ref: string): EBranch => {
    const match = ref.match(BRANCH_REGEX);
    const branch = match && match[1];
    return branch as EBranch;
};

export const isBotPush = (pusherName: string) => pusherName.indexOf(BOT) > 0;