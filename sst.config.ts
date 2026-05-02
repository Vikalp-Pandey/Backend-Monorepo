// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      home: 'aws',
      name: 'backend-monorepo',
    };
  },
  async run() {
    new sst.aws.StaticSite('Storex', {
      path: 'apps/ui',
      build: {
        command: 'pnpm run build',
        output: 'dist',
      },
      environment: {
        VITE_API_URL: process.env.VITE_API_URL ?? "https://api.storex.kapidron.dk/api/",
      }
    });
  },
});
