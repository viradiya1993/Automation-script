// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  url: "https://automationhq.ai/",
  api_url: "https://api-test.automationhq.ai/",
  execution_link:
    "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/test/automationhq-standalone-executor-3.0.1.RELEASE.jar",

  agents: [
    {
      name: "Download Agent for Windows",
      link:
        "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/test/AutomationHQ+Agent+Setup+1.0.0.exe"
    },
    {
      name: "Download Agent for MacOS",
      link:
        "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/test/AutomationHQ+Agent-1.0.0.dmg"
    },
    {
      name: "Download Agent for Linux",
      link:
        "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/test/AutomationHQ+Agent-1.0.0.AppImage"
    }
  ]
};
