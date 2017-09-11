#!/bin/sh

git subtree pull --squash --prefix=talks/ talks gh-pages || true
