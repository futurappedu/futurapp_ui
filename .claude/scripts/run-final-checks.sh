#!/bin/bash

# Final quality checks before commit/PR
# Usage: .claude/scripts/run-final-checks.sh

set -e

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

echo "=== Running Final Checks ==="
echo ""

FAILED_CHECKS=()
ERROR_OUTPUT=""

# Lint
echo "-> Running lint..."
LINT_OUTPUT=$(npm run lint 2>&1) || {
  FAILED_CHECKS+=("lint")
  ERROR_OUTPUT+="
=== Lint Errors ===
$LINT_OUTPUT
"
}

# Build (includes TypeScript compilation via tsc -b)
echo "-> Running build..."
BUILD_OUTPUT=$(npm run build 2>&1) || {
  FAILED_CHECKS+=("build")
  ERROR_OUTPUT+="
=== Build Errors ===
$BUILD_OUTPUT
"
}

# Report results
echo ""
if [ ${#FAILED_CHECKS[@]} -gt 0 ]; then
  echo "The following checks failed:" >&2
  printf '  - %s\n' "${FAILED_CHECKS[@]}" >&2
  echo "$ERROR_OUTPUT" >&2
  echo ""
  echo "Fix these issues before committing."
  exit 1
fi

echo "All checks passed!"
exit 0
