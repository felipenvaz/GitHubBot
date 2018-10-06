import { ORGANIZATION, ONLY_NEW_EVENTS } from './env';
import { listRepositories } from './api/repositories';
import IRepository from './interfaces/IRepository';
import { merge, IMergeResult } from './api/merge';
import { listRepositoryEvents } from './api/events';
import IPushEvent from './interfaces/IPushEvent';
import { getBranchType } from './util';
import EBranch from './enums/EBranch';
import { DEBUG } from './env';
import { createPullRequest } from './api/pullRequest';
import IPullRequest from './interfaces/IPullRequest';
import { fetch } from './fetch';

const initialDate = new Date();

const wait = async (seconds: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

(async () => {
  const repositories: IRepository[] =
    [
      {
        name: 'LoginSite',
        full_name: 'HippoCMMS/LoginSite',
        owner: { login: 'HippoCMMS' }
      }
    ];
  //await listRepositories(ORGANIZATION);
  const eTags: { [repoName: string]: string } = repositories.reduce(
    (acc, repo) => ({ ...acc, [repo.name]: '' })
    , {});

  const checkEvents = async () => {
    let maxPollInterval = 0;

    for (const repo of repositories) {
      let mergeMaster = false;
      let mergeRelease = false;

      const { xPollInterval, eTag, events, notModified } = await listRepositoryEvents({
        owner: repo.owner.login,
        repository: repo.name,
        eTag: eTags[repo.name]
      });

      if (notModified) {
        if (DEBUG)
          console.log(`Branch ${repo.name} had no new events`);
      } else {
        eTags[repo.name] = eTag;
        maxPollInterval = Math.max(maxPollInterval, xPollInterval);
        for (const event of events) {
          if (ONLY_NEW_EVENTS && (new Date(event.created_at)) < initialDate) {
            if (DEBUG)
              console.log(`Stoping event analysis because events were before initial date.`);
            break;
          }

          if (event.type === 'PushEvent') {
            const { payload } = event as IPushEvent;
            const branch = getBranchType(payload.ref);
            mergeMaster = branch === EBranch.master || mergeMaster;
            mergeRelease = branch === EBranch.master || branch === EBranch.release || mergeRelease;
          }
        }

        console.log(`MERGE: branch ${repo.name} master:${mergeMaster} release:${mergeRelease}`);
        let mergeResponse: IMergeResult = null;
        if (mergeMaster) {
          mergeResponse = await merge({
            owner: repo.owner.login,
            repository: repo.name,
            base: EBranch.release,
            head: EBranch.master,
            commit_message: `Bot - Merge ${EBranch.master} into ${EBranch.release}`
          });
        }

        if (mergeRelease && (mergeResponse === null || !mergeResponse.conflict)) {
          mergeResponse = await merge({
            owner: repo.owner.login,
            repository: repo.name,
            base: EBranch.develop,
            head: EBranch.release,
            commit_message: `Bot - Merge ${EBranch.release} into ${EBranch.develop}`
          });
        }

        //TODO if conflict happens, create new branch, open PR and make the commit owner(s) as PR assignees (should also message on slack)
        //TODO maybe when creating PR, a PR already exists. 
      }
    }

    return maxPollInterval;
  }

  while (true) {
    if (DEBUG)
      console.log((new Date()).toTimeString());
    const pollInterval = await checkEvents();
    if (DEBUG)
      console.log(`Done checking for events`);
    await wait(Math.max(pollInterval, 60));
  }
})();