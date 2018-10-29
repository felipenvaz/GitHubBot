import { ORGANIZATION } from './env';
import { listRepositories } from './api/repositories';
import IRepository from './interfaces/IRepository';
import { merge } from './api/merge';
import EBranch from './enums/EBranch';
import logger, { ELogType } from './logger';
import { createTag } from './api/tag';

(async () => {
  const version = process.argv[2];
  if (!version || !(/v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/).test(version)) {
    logger.log(`Invalid version number`, ELogType.error);
    return;
  }

  const repositories: IRepository[] =
    /* [
      {
        name: 'KpiDashboard',
        full_name: 'HippoCMMS/KpiDashboard',
        owner: { login: 'HippoCMMS' },
        archived: false
      }
    ]; */
    await listRepositories(ORGANIZATION);

  const nothingToMerge = [];
  const conflicts = [];
  const merged = [];

  for (const repository of repositories) {
    if (repository.archived) continue;

    const {
      owner,
      name
    } = repository;

    const response = await merge({
      owner: owner.login,
      repository: name,
      base: EBranch.master,
      head: EBranch.release
    });

    if (response.nothingToMerge) nothingToMerge.push(name);
    else if (response.conflict) conflicts.push(name);
    else if (response.created) {
      merged.push(name);
      try {
        await createTag({
          owner: owner.login,
          repository: name,
          sha: response.sha,
          version
        });
      } catch (exception) {
        logger.log(JSON.stringify(exception), ELogType.error);
      }
    }
  }

  logger.log(`Merged: ${merged.join(', ')}`);
  logger.log(`Conflict: ${conflicts.join(', ')}`);
  logger.log(`Nothing to merge: ${nothingToMerge.join(', ')}`);
})();