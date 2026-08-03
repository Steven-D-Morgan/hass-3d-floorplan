import { test, expect } from '@playwright/test';

// Smoke test: boot the built card against a stubbed Home Assistant shadow-DOM
// chain, load a real GLB, and assert the WebGL canvas actually renders the model
// (not just an empty background). Guards the whole load pipeline — fetch, cache,
// GLTF parse, scene build, camera framing — against regressions.

const BG = [51, 102, 153]; // #336699 harness background

function isBackground(px: number[]): boolean {
  return Math.abs(px[0] - BG[0]) < 12 && Math.abs(px[1] - BG[1]) < 12 && Math.abs(px[2] - BG[2]) < 12;
}

test('card renders the model to the canvas', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));

  await page.goto('/dev/harness.html?file=cube.glb');

  // Wait for the canvas to come up.
  await page.waitForFunction(() => (window as any).__metrics && (window as any).__metrics().ready, null, {
    timeout: 15000,
  });

  const metrics = await page.evaluate(() => (window as any).__metrics());
  expect(metrics.ready).toBe(true);
  // Pixel-ratio cap: backing store must not exceed 2x the 800x520 CSS size.
  expect(metrics.canvasWidth).toBeLessThanOrEqual(1600);

  // The centre of the frame should show the model, not the background.
  const center = await page.evaluate(() => (window as any).__samplePixel(400, 260));
  expect(center).not.toBeNull();
  expect(isBackground(center as number[])).toBe(false);

  expect(errors, 'no console errors during load').toEqual([]);
});

test('pixel ratio is capped by max_pixel_ratio', async ({ page }) => {
  await page.goto('/dev/harness.html?file=cube.glb&dpr=1');
  await page.waitForFunction(() => (window as any).__metrics && (window as any).__metrics().ready, null, {
    timeout: 15000,
  });
  const metrics = await page.evaluate(() => (window as any).__metrics());
  // dpr=1 forces a 1:1 backing store for the 800x520 CSS canvas.
  expect(metrics.canvasWidth).toBe(800);
  expect(metrics.canvasHeight).toBe(520);
});
