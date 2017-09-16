#!/bin/sh

if [[ `git remote | grep talks | wc -l` -eq 0 ]]; then
    git remote add talks https://github.com/fhemberger/talks.git || true
    git subtree add --squash --prefix=talks/ talks gh-pages || true
fi
