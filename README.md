# jdh.onl

Personal site and link hub at [jdh.onl](https://jdh.onl).

## Stack

- **Site:** Hugo with the [Console](https://github.com/mrmierzejewski/hugo-theme-console) theme (installed via Hugo modules)
- **Hosting:** Cloudflare Pages with Git-triggered deploys
- **Infrastructure:** Pulumi (TypeScript) managing the Pages project, custom domain, DNS, and www-to-apex redirect
- **Secrets:** Pulumi ESC for API tokens and account config

## Why Pulumi for a personal site?

I manage all my infrastructure as code — personal projects included. It keeps deployments reproducible, config auditable, and means I can tear down and recreate the entire setup from a single `pulumi up`. The same approach I use at work, applied consistently.

## Local development

```bash
hugo server -D
```

## Deployment

Pushes to `main` trigger a build on Cloudflare Pages automatically. Infrastructure changes go through Pulumi:

```bash
cd infra
pulumi preview
pulumi up
```
