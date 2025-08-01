import { Config } from '@stencil/core';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config: Config = {
  namespace: 'fastt-web-components',
  globalStyle: 'src/global/global.css',
  env: {
    API_URL: process.env.API_URL,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: 'shell',
  },
};
