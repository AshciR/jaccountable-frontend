# PostHog Reverse Proxy

A lightweight nginx reverse proxy for PostHog analytics. It sits between the frontend and PostHog's servers, which helps avoid ad blockers that block direct requests to `posthog.com`.

## How it works

The proxy runs nginx on port `8080` and forwards traffic to PostHog's US region:

| Path             | Upstream                          |
| ---------------- | --------------------------------- |
| `/static/*`      | `us-assets.i.posthog.com/static/` |
| `/array/*`       | `us-assets.i.posthog.com/array/`  |
| `/*` (all other) | `us.i.posthog.com`                |

## Deployment

The proxy is deployed as a Docker container on [Render](https://render.com).

The frontend points to it via the `PUBLIC_POSTHOG_API_HOST` environment variable:

| Environment | Value                   |
| ----------- | ----------------------- |
| development | `http://localhost:8080` |
| staging     | `<redacted>`            |

## Local development

```bash
docker build -t posthog-proxy .
docker run -p 8080:8080 posthog-proxy
```
