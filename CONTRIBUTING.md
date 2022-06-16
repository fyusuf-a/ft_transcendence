# Contributing

## Issues

Enhancement and bugs are signaled by opening an issue:
- please use the following labels (if applicable) to help your issue gain visibility:
	* backend
	* frontend
	* documentation
	* ci-cd
	* enhancement
	* bug

- assign a milestone to your issue if possible.

## Contributing to code

- Branch from `master`
- Commit and push -- to your remote branch, not `master` -- as usual. Try to commit features in an orderly manner so that the following step makes sense.
- When you are done with your changes, rebase from `origin/master` and squash commits sensibly. Give a commit description that describes your changes accurately. Use [the conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0/). You can find example of scopes in your git history (`git log`).
- Make a Pull Request (PR) on GitHub.
- You have to pass the automated tests before asking for a review. If you fail them, commit and push a fix on the same branch, the tests will be rerun.
- Ask for 2 reviews on Discord
- The 2nd reviewer will merge the changes and delete your remote branch.

Particular case:
- The reviewer discusses your code. Discuss and/or make the suggested changes. All conversations must be resolved before merging.

Rules of thumb:
- Use conventional commits everywhere, even before squashing. It will force you to adopt an organised mindset.
- Each issue/feature should have its own branch and PR. This will keep PRs short, which speeds up the review process and prevents reviewers from getting overwhelmed. Short, isolated PRs mean that independent parts can be reviewed and merged quickly without waiting for comment resolution on unrelated features.
- Everything on the repository is public. Hence keep your interactions calm, respectful and polite. Also, please refrain from naming commits with descriptions like `pushing my branch`, `whatever`, `hello`, etc.


