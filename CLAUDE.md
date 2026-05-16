@AGENTS.md

## Git ワークフロー

- アプリケーションコード（`app/`, `components/`, `hooks/`, `types/` 配下）を変更する場合は、
  必ずフィーチャーブランチを切り、PR経由でmasterにマージすること。
  masterへの直接コミットは禁止。
- CI/CD設定（`.github/`）や設定ファイルのみの変更は直接コミットでも可。
- git push の前に必ずユーザーに確認を取ること。
