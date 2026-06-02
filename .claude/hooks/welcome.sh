#!/bin/bash

echo "=== Futurapp — Career Recommender Platform ==="
echo ""
echo "<session-context>"

# Current branch
BRANCH=$(git branch --show-current 2>/dev/null)
if [ -n "$BRANCH" ]; then
  if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
    echo "Branch: $BRANCH (consider creating a feature branch before making changes)"
  else
    echo "Branch: $BRANCH"
  fi
fi

# Git status (uncommitted work)
CHANGES=$(git status --porcelain 2>/dev/null | head -5)
if [ -n "$CHANGES" ]; then
  echo "Uncommitted:"
  echo "$CHANGES"
fi

# Open issues (if gh available)
if command -v gh &> /dev/null && gh auth status &> /dev/null 2>&1; then
  ISSUES=$(gh issue list --limit 3 --state open --json number,title --jq '.[] | "#\(.number) \(.title)"' 2>/dev/null)
  if [ -n "$ISSUES" ]; then
    echo "Open issues:"
    echo "$ISSUES"
  fi
fi

echo "</session-context>"
echo ""
echo "Analyze the above and suggest what to work on. Keep it brief."
