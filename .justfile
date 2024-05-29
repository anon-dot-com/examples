version := "0.1.0"

updateUpstream:
  #!/usr/bin/env bash
  # we use `git subtree` here to push the examples directory to a separate repo
  # https://github.com/anon-dot-com/examples

  current_branch=$(git branch --show-current)

  if [ "$current_branch" == "development" ]; then
    echo "Update examples repo"
    # `git subtree` must be run from project root
    cd {{justfile_directory()}}/../../ && \
    git subtree -P lib/examples-public push git@github.com:anon-dot-com/examples.git main
  else
    echo "You must be on the development branch to update upstream."
  fi
