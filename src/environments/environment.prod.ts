export const environment = {
  production: true,
  url: "http://automationhq.ai/",
  api_url: "https://api.automationhq.ai/",
  execution_link:
    "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/prod/automationhq-standalone-executor-3.0.1.RELEASE.jar",
  agents: [
    {
      name: "Download Agent for Windows",
      link:
        "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/prod/AutomationHQ+Agent+Setup+1.0.0.exe"
    },
    {
      name: "Download Agent for MacOS",
      link:
        "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/prod/AutomationHQ+Agent-1.0.0.dmg"
    },
    {
      name: "Download Agent for Linux",
      link:
        "https://s3.us-east-2.amazonaws.com/standalones.automationhq.ai/ui/prod/AutomationHQ+Agent-1.0.0.AppImage"
    }
  ]
};
