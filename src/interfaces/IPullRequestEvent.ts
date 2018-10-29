import IPullRequest from './IPullRequest';

export default interface IPullRequestEvent {
    action: 'opened' | 'reopened' | 'closed',
    pull_request: IPullRequest;
}