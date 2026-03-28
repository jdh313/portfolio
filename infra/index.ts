import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare";

const config = new pulumi.Config();
const accountId = config.require("cloudflareAccountId");
const zoneId = config.require("cloudflareZoneId");

const portfolioPagesProject = new cloudflare.PagesProject(
  "portfolio_pages_project",
  {
    accountId: accountId,
    name: "portfolio",
    productionBranch: "main",
    buildConfig: {
      buildCaching: true,
      buildCommand: "hugo",
      destinationDir: "public",
      rootDir: "/",
    },
    deploymentConfigs: {
      preview: {
        envVars: {
          HUGO_BASEURL: {
            type: "plain_text",
            value: "https://portfolio-20y.pages.dev/",
          },
        },
      },
      production: {
        envVars: {
          HUGO_BASEURL: {
            type: "plain_text",
            value: "https://jdh.onl/",
          },
        },
      },
    },
    source: {
      type: "github",
      config: {
        deploymentsEnabled: true,
        owner: "jdh313",
        ownerId: "13279035",
        repoName: "portfolio",
        repoId: "1193996847",
        productionBranch: "main",
      },
    },
  },
);

const dnsRecord = new cloudflare.DnsRecord("portfolio_cname", {
  zoneId: zoneId,
  name: "@",
  type: "CNAME",
  content: "portfolio-20y.pages.dev",
  proxied: true,
  ttl: 1, // automatic — required for proxied records
});

const pagesDomain = new cloudflare.PagesDomain(
  "portfolio_domain",
  {
    accountId: accountId,
    projectName: portfolioPagesProject.name,
    name: "jdh.onl",
  },
  { dependsOn: [dnsRecord] },
);

// Dummy A record for www — Cloudflare intercepts this because it's proxied
const wwwRecord = new cloudflare.DnsRecord("www_redirect_record", {
  zoneId: zoneId,
  name: "www",
  type: "A",
  content: "192.0.2.1",
  proxied: true,
  ttl: 1, // automatic — required for proxied records
});

// 301 redirect www.jdh.onl → jdh.onl
const wwwRedirect = new cloudflare.Ruleset("www_redirect", {
  zoneId: zoneId,
  name: "WWW to Apex Redirect",
  phase: "http_request_dynamic_redirect",
  kind: "zone",
  description: "Redirect www.jdh.onl to jdh.onl",
  rules: [
    {
      description: "Redirect www to apex",
      expression: '(http.host eq "www.jdh.onl")',
      action: "redirect",
      actionParameters: {
        fromValue: {
          statusCode: 301,
          targetUrl: {
            expression: 'concat("https://jdh.onl", http.request.uri.path)',
          },
          preserveQueryString: true,
        },
      },
      enabled: true,
    },
  ],
});

export const siteUrl = "https://jdh.onl/";
export const pagesDevUrl = pulumi.interpolate`https://${portfolioPagesProject.subdomain}`;
