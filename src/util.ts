import EBranch from './enums/EBranch';
import { GITHUB_WEBHOOK_SECRET } from './env';
import crypto from 'crypto';

const BRANCH_REGEX = /refs\/heads\/(.*)/;
export const getBranchType = (ref: string): EBranch => {
    const match = ref.match(BRANCH_REGEX);
    const branch = match && match[1];
    return branch as EBranch;
};

export const isValidSecret = (secret: string, payload: any) => {
    const hmac = crypto.createHmac('sha1', GITHUB_WEBHOOK_SECRET);
    hmac.update(JSON.stringify(payload));
    const calculatedSignature = 'sha1=' + hmac.digest('hex');
    return secret === calculatedSignature;
};