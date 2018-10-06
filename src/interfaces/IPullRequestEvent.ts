import IActor from './IActor';
import IPullRequest from './IPullRequest';
import IEvent from './IEvent';

export default interface IPullRequestEvent extends IEvent {
    type: 'PullRequestEvent';
    actor: IActor;
    payload: {
        action: 'opened' | 'closed',
        pull_request: IPullRequest;
    }
}