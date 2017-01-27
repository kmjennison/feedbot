#!/bin/bash
set -e
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)} 
COMMIT_MSG=${TRAVIS_COMMIT_MESSAGE}
STAGE_FROM_COMMIT_MSG=`echo $COMMIT_MSG | sed -nr -e 's/@stage=([a-zA-Z_-]+).*/\1/p'`
if [[ -n "$STAGE_FROM_COMMIT_MSG" ]]; then
  STAGE=$STAGE_FROM_COMMIT_MSG
fi
elif [[ $BRANCH == 'master' ]]; then
  STAGE="prod"
elif [[ $BRANCH == 'develop' ]]; then
  STAGE="dev"
fi
if [ -z ${STAGE+x} || $STAGE == 'nodeploy' ]; then
  echo "Not deploying changes";
  exit 0;
fi
echo "Deploying from branch $BRANCH to stage $STAGE"
npm prune --production  #remove devDependencies
sls deploy --stage $STAGE --region $AWS_REGION
