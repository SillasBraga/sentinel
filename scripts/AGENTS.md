# Script instructions

- Scripts are development/maintenance tools and must fail safely with actionable output.
- Read secrets from environment variables; never embed remote credentials.
- Default to local services and require an explicit opt-in for destructive or remote operations.
- Keep scripts idempotent when practical and document their command in the root README.
