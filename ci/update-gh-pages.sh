#!/usr/bin/env bash

GH_PAGES_REPO_AUTHENTICATED="https://$GH_TOKEN@github.com/meggsimum/wegue.git"

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "This looks like a pull request, not doing anything."
    exit 1;
fi

if ! [[ "$TRAVIS_BRANCH" =~ ^master$ ]]; then
    echo "Target branch is not 'master', not doing anything."
    exit 1;
fi

npm run deploy -- --repo $GH_PAGES_REPO_AUTHENTICATED
