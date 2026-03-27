import * as pulumi from "@pulumi/pulumi";
import * as cloudflare from "@pulumi/cloudflare"


const config = new pulumi.Config()
const portfolioPagesProject = new cloudflare.PagesProject("portfolio_pages_project",
  {
    accountId: config.require("cloudflareAccountId"),
    name: "portfolio",
    productionBranch: "main",
    buildConfig: {
      buildCaching: true,
      buildCommand: "hugo",
      destinationDir: "public",
      rootDir: "/",
    },
    source: {
      type: "github",
      config: {
        deploymentsEnabled: true,
        owner: "jdh313",
        ownerId: "13279035",
        repoName: "portfolio",
        repoId: "1193996847",
        productionBranch: "main"
      }
    }
  }
)