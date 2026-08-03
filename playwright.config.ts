import { defineConfig, devices } from '@playwright/test';

// Runs the dev/ smoke tests against the built card. `npm run test` regenerates
// the GLB fixture and builds dist/ first (see package.json), then Playwright
// starts the zero-dependency static server below and drives headless Chromium.
export default defineConfig({
  testDir: './dev',
  testMatch: '**/*.spec.ts',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'list' : 'html',
  use: {
    baseURL: 'http://localhost:5173',
    // WebGL needs a GPU-ish backend; SwiftShader (software) is bundled with Chromium.
    launchOptions: {
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node dev/serve.js',
    url: 'http://localhost:5173/dev/harness.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
