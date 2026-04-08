/**
 * Purpose: Wrap feature predicates with `advancedAuto` gate.
 * Description:
 * - Used by rare / decomposition-sensitive fan rows.
 */
export function advancedDetect(predicate) {
  return (ctx) => ctx.input?.advancedAuto === true && predicate(ctx);
}
