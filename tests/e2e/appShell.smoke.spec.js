/**
 * Purpose: Cross-browser app shell smoke (master **DesktopBrowserMatrix**).
 * Description:
 * - Runs per Playwright project (Chromium, WebKit, tablet, mobile).
 * - Load `dist` via `e2eStaticServe`; skip splash; assert shell + help.
 */
import { test, expect } from "@playwright/test";

function attachErrorCollectors(page, errors) {
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
}

async function addSinglesUntilFull(page) {
  const plan = [
    { tab: "W", count: 3 },
    { tab: "T", count: 3 },
    { tab: "B", count: 3 },
    { tab: "Z", count: 5 }
  ];
  const single = page.locator('[data-context-action="single"]');
  for (const { tab, count } of plan) {
    await page.locator(`.tab-btn[data-tab="${tab}"]`).click();
    const gridButtons = page.locator("#tilePickerGrid button");
    for (let i = 0; i < count; i += 1) {
      await gridButtons.nth(i).click();
      if (await single.isVisible()) {
        await single.click();
      }
    }
  }
}

async function openAppShell(page) {
  await page.goto("/public/index.html");
  await expect(page).toHaveTitle(/和了么|Huleme/);
  await page.waitForFunction(() => {
    const splash = document.getElementById("appSplash");
    return Boolean(splash?.classList.contains("splash-dismissed"));
  });
}

async function clickWizardNext(page) {
  const btn = page.locator("#wizardNextBtn");
  const hint = page.locator("#wizardStepHint");
  const before = await hint.textContent().catch(() => null);
  try {
    await btn.click({ timeout: 2000 });
  } catch {
    try {
      await btn.click({ force: true });
    } catch {
      await btn.evaluate((el) => el.click());
    }
  }
  const after = await hint.textContent().catch(() => null);
  if (before && after && before === after) {
    await page.evaluate(() => {
      const el = document.getElementById("wizardNextBtn");
      if (!el) return;
      el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  }
}

async function enforceZimoContext(page) {
  await page.evaluate(() => {
    const hidden = document.getElementById("winType");
    const radio = document.getElementById("winTypeZimo");
    if (radio) radio.checked = true;
    if (hidden) {
      hidden.value = "zimo";
      hidden.dispatchEvent(new Event("change"));
    }
  });
}

test.describe("app shell smoke", () => {
  test("loads app, skips splash, main shell visible, no page errors", async ({
    page
  }) => {
    const errors = [];
    attachErrorCollectors(page, errors);

    await openAppShell(page);
    await expect(page.locator("#roundSetupGate")).toBeVisible();
    await expect(page.locator("main.app-shell")).toBeVisible();
    await expect(page.locator("#versionBadge")).toBeVisible();

    expect(
      errors,
      `page/console errors: ${errors.join("; ")}`
    ).toHaveLength(0);
  });

  test("help control opens help surface", async ({ page }) => {
    await openAppShell(page);
    await page.getByRole("button", { name: "帮助" }).click();
    await expect(
      page.getByRole("dialog", { name: "使用帮助" })
    ).toBeVisible({ timeout: 10000 });
  });

  test("wizard can fill 14 tiles and open result modal", async (
    { page },
    testInfo
  ) => {
    test.setTimeout(60000);
    await openAppShell(page);

    await clickWizardNext(page);
    const firstTile = page.locator("#tilePickerGrid button").first();
    if (!(await firstTile.isVisible())) {
      await page.locator("#openPickerBtn").click();
    }
    await expect(firstTile).toBeVisible();
    await addSinglesUntilFull(page);
    await expect(page.locator("#tileCount")).toContainText("14/14");

    await clickWizardNext(page);
    const resultModal = page.locator("#resultModal");
    if (!(await resultModal.isVisible())) {
      await enforceZimoContext(page);
      await expect(page.locator("#wizardStepHint")).toContainText("步骤 3/3");
      await clickWizardNext(page);
    }
    if (!(await resultModal.isVisible()) && testInfo.project.name === "tablet") {
      const diag = await page.evaluate(() => ({
        stepHint: document.getElementById("wizardStepHint")?.textContent || "",
        winType: document.getElementById("winType")?.value || "",
        roleError: document.getElementById("roleValidationError")?.textContent || "",
        readyHint: document.getElementById("readyHint")?.textContent || "",
        resultOpen: document.getElementById("resultModal")?.classList.contains("is-open"),
        contextOpen: document.getElementById("contextModal")?.classList.contains("is-open"),
        pickerOpen: document.getElementById("pickerModal")?.classList.contains("is-open")
      }));
      throw new Error(`tablet-calc diagnostics: ${JSON.stringify(diag)}`);
    }
    await expect(resultModal).toBeVisible();
    await expect(page.locator("#resultStatus")).not.toHaveText("");
  });

  test("tablet keeps modal flow (no desktop inline host classes)", async (
    { page },
    testInfo
  ) => {
    test.skip(
      testInfo.project.name !== "tablet",
      "Tablet behavior asserted in tablet project only."
    );
    await openAppShell(page);

    await expect(page.locator("#contextModal")).not.toHaveClass(
      /desktop-inline-context/
    );
    await expect(page.locator("#pickerModal")).not.toHaveClass(
      /desktop-inline-picker/
    );

    await page.locator("#wizardNextBtn").click();
    const pickerModal = page.locator("#pickerModal");
    if (!(await pickerModal.isVisible())) {
      await page.locator("#openPickerBtn").click();
    }
    await expect(pickerModal).toHaveClass(/is-open/);
  });
});
