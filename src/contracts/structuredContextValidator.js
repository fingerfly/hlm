/**
 * Purpose: Validate optional structured hand context fields.
 * Description:
 * - Checks optional enum, number, object, and boolean inputs.
 * - Appends clear validation problems into a shared array.
 * - Keeps `handState` focused on orchestration and required fields.
 */
const WAIT_TYPES = Object.freeze(["edge", "closed", "single"]);
const SPECIAL_PATTERNS = Object.freeze([
  "qixing_bukao",
  "quan_bu_kao",
  "zu_he_long"
]);

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

function isDefined(value) {
  return value !== undefined;
}

function addOptionalEnumProblems(input, checks, problems) {
  for (const [field, allowed] of checks) {
    if (!isDefined(input[field])) continue;
    if (!allowed.includes(input[field])) {
      problems.push(`${field} must be one of: ${allowed.join("/")}`);
    }
  }
}

function addOptionalBooleanProblems(input, fields, problems) {
  for (const field of fields) {
    if (!isDefined(input[field])) continue;
    if (typeof input[field] !== "boolean") {
      problems.push(`${field} must be boolean when provided`);
    }
  }
}

function addKongSummaryProblems(input, problems) {
  if (!isDefined(input.kongSummary)) return;
  const ks = input.kongSummary;
  if (typeof ks !== "object" || ks === null) {
    problems.push("kongSummary must be an object when provided");
    return;
  }
  for (const field of ["an", "ming"]) {
    if (!isDefined(ks[field])) continue;
    if (!isNonNegativeInteger(ks[field])) {
      problems.push(`kongSummary.${field} must be a non-negative integer`);
    }
  }
  const anVal = isNonNegativeInteger(ks.an) ? ks.an : 0;
  const mingVal = isNonNegativeInteger(ks.ming) ? ks.ming : 0;
  if (anVal + mingVal > 4) {
    problems.push("kongSummary an+ming cannot exceed 4");
  }
}

/**
 * Validate optional structured context fields.
 *
 * @param {object} [input={}] - Optional hand context payload.
 * @param {string[]} [problems=[]] - Mutable list of validation issues.
 * @returns {void}
 */
export function addStructuredContextProblems(input = {}, problems = []) {
  addOptionalEnumProblems(
    input,
    [
      ["waitType", WAIT_TYPES],
      ["specialPattern", SPECIAL_PATTERNS]
    ],
    problems
  );

  if (isDefined(input.flowerCount)) {
    if (!isNonNegativeInteger(input.flowerCount)) {
      problems.push("flowerCount must be a non-negative integer");
    } else if (input.flowerCount > 8) {
      problems.push("flowerCount cannot exceed 8");
    }
  }

  if (
    isDefined(input.concealedPungCount)
    && !isNonNegativeInteger(input.concealedPungCount)
  ) {
    problems.push("concealedPungCount must be a non-negative integer");
  }
  if (input.concealedPungCount > 4) {
    problems.push("concealedPungCount cannot exceed 4");
  }

  addKongSummaryProblems(input, problems);
  addOptionalBooleanProblems(
    input,
    ["allSetsMelded", "noMeldClaims", "lastTileOfKind", "isChickenHand"],
    problems
  );
}
