# HLM Deploy to GitHub (Mermaid Guide)

This file describes the deployment path for `hlm` to GitHub and GitHub
Pages using Mermaid diagrams.

## 1) Current Deployment Flow (Repository Today)

```mermaid
flowchart TD
  A[Push to main with public/src/index/workflow changes]
  --> B[GitHub Actions: deploy-pages.yml]
  B --> C[Build dist and upload Pages artifact from path dist]
  C --> D[Deploy via actions/deploy-pages]
  D --> E[Root index.html redirects to public/index.html]
  E --> F[Live at https://<owner>.github.io/<repo>/]
```

## 2) Target Deployment Flow (After Migration)

```mermaid
flowchart TD
  A[Local hlm changes] --> B[Run local quality gates]
  B --> C{All gates pass?}
  C -- No --> B1[Fix issues and rerun tests]
  B1 --> B
  C -- Yes --> D[Commit changes]
  D --> E[Push branch to GitHub]
  E --> F[Open PR to main]
  F --> G[CI test workflow runs]
  G --> H{CI green?}
  H -- No --> I[Fix branch and push updates]
  I --> G
  H -- Yes --> J[Merge PR to main]
  J --> K[Security scan workflow runs]
  K --> L{Security scan pass?}
  L -- No --> I
  L -- Yes --> M[Deploy workflow runs]
  M --> N[Publish dist runtime artifact]
  N --> O[Live at https://<owner>.github.io/<repo>/]
```

## 3) Target CI/CD Workflow Sequence

> Note: `test.yml` and `deploy.yml` are target workflow files for the
> GitHub Pages migration plan. They are referenced as the intended deploy
> state and may not exist yet in the current repo snapshot.

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant GH as GitHub
  participant CI as test_or_deploy_checks
  participant Sec as security_scan_yml
  participant CD as deploy_pages_yml
  participant Pages as GitHub Pages

  Dev->>GH: Push branch
  GH->>CI: Trigger tests on push/PR
  CI-->>GH: Pass/Fail status
  GH->>Sec: Trigger security scan on push/PR
  Sec-->>GH: Pass/Fail status
  Dev->>GH: Open PR to main
  GH->>CI: Re-run checks for PR
  CI-->>GH: Required checks pass
  Dev->>GH: Merge PR
  GH->>CD: Trigger deploy on main
  CD->>Pages: Upload and deploy dist artifact
  Pages-->>Dev: Site update published
```

## 4) Migration-to-Deploy Relationship

```mermaid
flowchart LR
  M1[Monorepo path: 00_Mundo/.../hlm] --> M2[Subtree split]
  M2 --> M3[Dedicated repo: <owner>/<repo>]
  M3 --> M4[Root layout refactor]
  M4 --> M5[Add test.yml and deploy.yml]
  M5 --> M6[Merge to main]
  M6 --> M7[GitHub Pages deployment]
```

## 5) Required Local Commands Before PR

```bash
npm test
npm run quality:complexity
```

## 6) Rollback Path

```mermaid
flowchart TD
  R1[Deployment issue found] --> R2[Identify bad commit]
  R2 --> R3[Create revert commit on main]
  R3 --> R4[Push revert]
  R4 --> R5[Deploy workflow re-runs]
  R5 --> R6[Pages restored to last good state]
```
