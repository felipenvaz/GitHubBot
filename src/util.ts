import EBranch from './enums/EBranch';

const BRANCH_REGEX = /refs\/heads\/(.*)/;
export const getBranchType = (ref: string): EBranch => {
    const match = ref.match(BRANCH_REGEX);
    const branch = match && match[1];
    return branch as EBranch;
};