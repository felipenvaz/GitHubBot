import IPullRequest from './IPullRequest';

export default interface IPullRequestEvent {
    action: 'opened' | 'reopened' | 'closed' | 'synchronize',
    pull_request: IPullRequest;
}