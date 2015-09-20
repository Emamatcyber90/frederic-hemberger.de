#!/bin/sh

find build -name "*.html" -exec sed  -i '' "s|<link rel=\"stylesheet\" href=\"\/static\/css\/styles\.css\" media=\"all\">|<style>$(cat build/static/css/styles.css)</style>|" {} \;
