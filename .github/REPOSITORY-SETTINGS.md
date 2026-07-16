# Repository settings after organization approval

Create `builtbychat/built-by-chat` as public, require organization 2FA, and make Phaenex an owner. Then configure `main` with no force pushes or deletion, pull requests required, one approving review, conversations resolved, linear history, and required checks: **CI / verify** and **Browser checks / playwright**. Enable secret scanning, push protection, Dependabot alerts/security updates, private vulnerability reporting, and issue discussions only when moderation coverage exists.

The current Phaenex GitHub CLI session is valid but lacks the `admin:org` scope. Refreshing that scope and creating the organization are user-operated checkpoints. Do not publish the repository until Phaenex approves the public release.
