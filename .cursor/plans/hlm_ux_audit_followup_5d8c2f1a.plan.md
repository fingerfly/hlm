---
name: hlm-ux-audit-followup
overview: >
  HLM UX follow-up from codebase audit: modal backdrop dismiss, help popover
  outside-click, splash skip, wizard/calculate hints, copy cleanup, result
  control label, player score bounds, optional score-rule disclosure, focus/Escape.
isProject: false
parentPlan: hlm-master-plan.plan.md
dependsOn:
  - hlm_onboarding_shell_merge_f9a1c8e0.plan.md
status: completed
completedDate: 2026-04-05
---

# HLM UX audit follow-up

## Parent

- [hlm-master-plan.plan.md](hlm-master-plan.plan.md)

## Dependencies

- Post–onboarding shell / three-step wizard:
  [hlm_onboarding_shell_merge_f9a1c8e0.plan.md](hlm_onboarding_shell_merge_f9a1c8e0.plan.md)
- Holistic / post-holistic UX tracks (historical context only).

## Acceptance criteria

1. **Backdrop dismiss:** Tap on dimmed modal root (target === root) closes
   picker, context, help, and result modals via same paths as `data-close`.
   No dismiss when `#pickerModal` has `desktop-inline-picker` or
   `#contextModal` has `desktop-inline-context`.
2. **Help popover:** Desktop: document outside-click closes popover;
   `aria-expanded` on `#moreBtn` stays in sync; Escape still works.
3. **Splash:** Visible「跳过」control dismisses splash immediately; keyboard
   reachable; respects reduced-motion timer for auto-dismiss.
4. **Auto-advance:** Help documents `localStorage` key
   `hlm_disableAutoWizardAdvance` (no duplicate aria-live unless added later).
5. **Calculate failure:** Step 3「下一步」when `calculate()` is false sets
   `#readyHint` unless `#roleValidationError` already shows a message.
6. **DOM:** Remove `#startRoundBtn`; update DOM contract tests.
7. **Copy:** `#resetContextBtn` label「重置和牌条件」; result fan row button
   visible text「释义」(keep `aria-label`).
8. **Scores:** Player score inputs `min`/`max`; `collectRoundPlayers` clamps to
   same bounds (`PLAYER_SCORE_MIN` / `PLAYER_SCORE_MAX` = -99999 / 99999).
9. **Advanced:**「结算规则」block wrapped in `<details class="context-advanced-details">`
   default closed; minimal CSS.
10. **Escape:** Escape closes open picker; context only when not
    `desktop-inline-context`; help modal; result modal.
11. **Focus:** After `openModalByKey`, focus first focusable in sheet for
    picker and context (inline context host when applicable); skip heavy trap.

## Files touched (implementation)

- [public/modalBackdropWiring.js](../public/modalBackdropWiring.js)
- [public/modalFocusUtils.js](../public/modalFocusUtils.js)
- [public/appModalActions.js](../public/appModalActions.js)
- [public/appEventWiring.js](../public/appEventWiring.js)
- [public/app.js](../public/app.js)
- [public/index.html](../public/index.html)
- [public/homeStateView.js](../public/homeStateView.js)
- [public/appStateActions.js](../public/appStateActions.js)
- [public/resultModalView.js](../public/resultModalView.js)
- [public/styles-components.css](../public/styles-components.css)
- Tests under [tests/unit/](../tests/unit/)

## Gates

- `npm test`, `npm run quality:complexity`, `cloc` on touched files,
  `npm run build:dist`, [CHANGELOG.md](../CHANGELOG.md) [Unreleased].
