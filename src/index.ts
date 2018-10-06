import { ORGANIZATION } from './env';
import { listRepositories } from './api/repositories';
import IRepository from './interfaces/IRepository';
import { merge } from './api/merge';
import { listRepositoryEvents } from './api/events';
import IPushEvent from './interfaces/IPushEvent';
import { getBranchType } from './util';
import EBranch from './enums/EBranch';
import { DEBUG } from './env';

const wait = async (seconds: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

(async () => {
  const repositories: IRepository[] =
    /* [
      {
        name: 'LoginSite',
        full_name: 'HippoCMMS/LoginSite',
        owner: { login: 'HippoCMMS' }
      }
    ]; */
    await listRepositories(ORGANIZATION);
  const eTags: { [repoName: string]: string } = repositories.reduce(
    (acc, repo) => ({ ...acc, [repo.name]: '' })
    , {});

  const checkEvents = async () => {
    let maxPollInterval = 0;

    for (const repo of repositories) {
      let mergeMaster = false;
      let mergeRelease = false;
      const { xPollInterval, eTag, events } = await listRepositoryEvents({
        owner: repo.owner.login,
        repository: repo.name,
        eTag: eTags[repo.name]
      });

      eTags[repo.name] = eTag;
      maxPollInterval = Math.max(maxPollInterval, xPollInterval);
      for (const event of events) {
        if (event.type === 'PushEvent') {
          const { actor, payload } = event as IPushEvent;
          /* if (DEBUG)
            console.log(`${actor.login} pushed to branch ${payload.ref} on ${repo.name}`); */

          const branch = getBranchType(payload.ref);
          mergeMaster = branch === EBranch.master || mergeMaster;
          mergeRelease = branch === EBranch.master || branch === EBranch.release || mergeRelease;
        }
      }

      console.log(`MERGE: branch ${repo.name} master:${mergeMaster} release:${mergeRelease}`);
    }

    return maxPollInterval;
  }

  // await checkEvents();
  while (true) {
    if (DEBUG)
      console.log((new Date()).toTimeString());
    const pollInterval = await checkEvents();
    if (DEBUG)
      console.log(`Done checking for events`);
    await wait(pollInterval);
  }

})();