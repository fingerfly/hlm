import test from "node:test";
import assert from "node:assert/strict";
import { detectFans } from "../../src/rules/fanDetectors.js";

test("detectFans returns qing yi se for pure one suit hand", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "2W", "3W", "4W",
        "5W", "6W", "7W",
        "3W", "4W", "5W",
        "9W", "9W"
      ],
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none"
    },
    { pattern: "standard" }
  );
  assert.equal(result.some((fan) => fan.id === "QING_YI_SE"), true);
});

test("detectFans returns duan yao for all simples hand", () => {
  const result = detectFans(
    {
      tiles: [
        "2W", "3W", "4W",
        "2W", "3W", "4W",
        "5T", "6T", "7T",
        "4B", "5B", "6B",
        "8T", "8T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    { pattern: "standard" }
  );
  assert.equal(result.some((fan) => fan.id === "DUAN_YAO"), true);
});

test("detectFans returns peng peng hu for all-pungs standard hand", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "2W", "2W", "2W",
        "3T", "3T", "3T",
        "5B", "5B", "5B",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["1W", "1W", "1W"] },
        { type: "pung", tiles: ["2W", "2W", "2W"] },
        { type: "pung", tiles: ["3T", "3T", "3T"] },
        { type: "pung", tiles: ["5B", "5B", "5B"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "PENG_PENG_HU"), true);
});

test("detectFans returns hun yao jiu for terminals-and-honors hand", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "9W", "9W", "9W",
        "1T", "1T", "1T",
        "E", "E", "E",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["1W", "1W", "1W"] },
        { type: "pung", tiles: ["9W", "9W", "9W"] },
        { type: "pung", tiles: ["1T", "1T", "1T"] },
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "HUN_YAO_JIU"), true);
});

test("detectFans returns zi yi se for all-honors hand", () => {
  const result = detectFans(
    {
      tiles: [
        "E", "E", "E",
        "S", "S", "S",
        "Wn", "Wn", "Wn",
        "N", "N", "N",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pung", tiles: ["S", "S", "S"] },
        { type: "pung", tiles: ["Wn", "Wn", "Wn"] },
        { type: "pung", tiles: ["N", "N", "N"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "ZI_YI_SE"), true);
  assert.equal(result.some((fan) => fan.id === "HUN_YAO_JIU"), false);
});

test("detectFans returns qing yao jiu for all-terminals hand", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "9W", "9W", "9W",
        "1T", "1T", "1T",
        "9T", "9T", "9T",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["1W", "1W", "1W"] },
        { type: "pung", tiles: ["9W", "9W", "9W"] },
        { type: "pung", tiles: ["1T", "1T", "1T"] },
        { type: "pung", tiles: ["9T", "9T", "9T"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "QING_YAO_JIU"), true);
  assert.equal(result.some((fan) => fan.id === "HUN_YAO_JIU"), false);
});

test("detectFans returns qing long for pure straight in one suit", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "4W", "5W", "6W",
        "7W", "8W", "9W",
        "2T", "3T", "4T",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["4W", "5W", "6W"] },
        { type: "chow", tiles: ["7W", "8W", "9W"] },
        { type: "chow", tiles: ["2T", "3T", "4T"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "QING_LONG"), true);
});

test("detectFans returns ping hu for four chows plus pair", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "4W", "5W", "6W",
        "2T", "3T", "4T",
        "6B", "7B", "8B",
        "5T", "5T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["4W", "5W", "6W"] },
        { type: "chow", tiles: ["2T", "3T", "4T"] },
        { type: "chow", tiles: ["6B", "7B", "8B"] },
        { type: "pair", tiles: ["5T", "5T"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "PING_HU"), true);
});

test("detectFans returns yi ban gao for duplicate chow", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "1W", "2W", "3W",
        "4T", "4T", "4T",
        "7B", "8B", "9B",
        "5W", "5W"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "pung", tiles: ["4T", "4T", "4T"] },
        { type: "chow", tiles: ["7B", "8B", "9B"] },
        { type: "pair", tiles: ["5W", "5W"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "YI_BAN_GAO"), true);
});

test("detectFans returns san se san tong shun for mixed triple chow", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "1T", "2T", "3T",
        "1B", "2B", "3B",
        "7W", "7W", "7W",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["1T", "2T", "3T"] },
        { type: "chow", tiles: ["1B", "2B", "3B"] },
        { type: "pung", tiles: ["7W", "7W", "7W"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "SAN_SE_SAN_TONG_SHUN"), true);
});

test("detectFans returns seat/prevalent wind pung fans from context", () => {
  const result = detectFans(
    {
      tiles: [
        "E", "E", "E",
        "1W", "2W", "3W",
        "4W", "5W", "6W",
        "7T", "8T", "9T",
        "5B", "5B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none",
      seatWind: "E",
      prevalentWind: "E"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["4W", "5W", "6W"] },
        { type: "chow", tiles: ["7T", "8T", "9T"] },
        { type: "pair", tiles: ["5B", "5B"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "MEN_FENG_KE"), true);
  assert.equal(result.some((fan) => fan.id === "QUAN_FENG_KE"), true);
});

test("detectFans returns big/little winds and dragons features", () => {
  const bigWinds = detectFans(
    {
      tiles: [
        "E", "E", "E",
        "S", "S", "S",
        "Wn", "Wn", "Wn",
        "N", "N", "N",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pung", tiles: ["S", "S", "S"] },
        { type: "pung", tiles: ["Wn", "Wn", "Wn"] },
        { type: "pung", tiles: ["N", "N", "N"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(bigWinds.some((fan) => fan.id === "DA_SI_XI"), true);

  const littleDragons = detectFans(
    {
      tiles: [
        "R", "R", "R",
        "G", "G", "G",
        "Wh", "Wh",
        "1W", "2W", "3W",
        "4T", "5T", "6T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["R", "R", "R"] },
        { type: "pung", tiles: ["G", "G", "G"] },
        { type: "pair", tiles: ["Wh", "Wh"] },
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["4T", "5T", "6T"] }
      ]
    }
  );
  assert.equal(littleDragons.some((fan) => fan.id === "XIAO_SAN_YUAN"), true);
});

test("detectFans returns hua long for mixed straight", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "4T", "5T", "6T",
        "7B", "8B", "9B",
        "E", "E", "E",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["4T", "5T", "6T"] },
        { type: "chow", tiles: ["7B", "8B", "9B"] },
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "HUA_LONG"), true);
});

test("detectFans returns xi xiang feng, lian liu and lao shao fu", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "1T", "2T", "3T",
        "4W", "5W", "6W",
        "7W", "8W", "9W",
        "5B", "5B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["1T", "2T", "3T"] },
        { type: "chow", tiles: ["4W", "5W", "6W"] },
        { type: "chow", tiles: ["7W", "8W", "9W"] },
        { type: "pair", tiles: ["5B", "5B"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "XI_XIANG_FENG"), true);
  assert.equal(result.some((fan) => fan.id === "LIAN_LIU"), true);
  assert.equal(result.some((fan) => fan.id === "LAO_SHAO_FU"), true);
});

test("detectFans returns que yi men and wu zi", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "2W", "3W", "4W",
        "5W", "6W", "7W",
        "7T", "8T", "9T",
        "9T", "9T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["1W", "1W", "1W"] },
        { type: "chow", tiles: ["2W", "3W", "4W"] },
        { type: "chow", tiles: ["5W", "6W", "7W"] },
        { type: "chow", tiles: ["7T", "8T", "9T"] },
        { type: "pair", tiles: ["9T", "9T"] }
      ]
    }
  );
  assert.equal(result.some((fan) => fan.id === "QUE_YI_MEN"), true);
  assert.equal(result.some((fan) => fan.id === "WU_ZI"), true);
});

test("detectFans returns shifted chow fans", () => {
  const mixedShifted = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "2T", "3T", "4T",
        "3B", "4B", "5B",
        "E", "E", "E",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["2T", "3T", "4T"] },
        { type: "chow", tiles: ["3B", "4B", "5B"] },
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(
    mixedShifted.some((fan) => fan.id === "SAN_SE_SAN_BU_GAO"),
    true
  );

  const pureShifted = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "2W", "3W", "4W",
        "3W", "4W", "5W",
        "E", "E", "E",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["2W", "3W", "4W"] },
        { type: "chow", tiles: ["3W", "4W", "5W"] },
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(pureShifted.some((fan) => fan.id === "YI_SE_SAN_BU_GAO"), true);
});

test("detectFans returns upper/lower/middle rank-range fans", () => {
  const allBig = detectFans(
    {
      tiles: [
        "7W", "8W", "9W",
        "7T", "8T", "9T",
        "7B", "8B", "9B",
        "7W", "8W", "9W",
        "9T", "9T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["7W", "8W", "9W"] },
        { type: "chow", tiles: ["7T", "8T", "9T"] },
        { type: "chow", tiles: ["7B", "8B", "9B"] },
        { type: "chow", tiles: ["7W", "8W", "9W"] },
        { type: "pair", tiles: ["9T", "9T"] }
      ]
    }
  );
  assert.equal(allBig.some((fan) => fan.id === "QUAN_DA"), true);
  assert.equal(allBig.some((fan) => fan.id === "DA_YU_WU"), true);

  const allSmall = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "1T", "2T", "3T",
        "1B", "2B", "3B",
        "1W", "2W", "3W",
        "1T", "1T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["1T", "2T", "3T"] },
        { type: "chow", tiles: ["1B", "2B", "3B"] },
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "pair", tiles: ["1T", "1T"] }
      ]
    }
  );
  assert.equal(allSmall.some((fan) => fan.id === "QUAN_XIAO"), true);
  assert.equal(allSmall.some((fan) => fan.id === "XIAO_YU_WU"), true);

  const allMiddle = detectFans(
    {
      tiles: [
        "4W", "5W", "6W",
        "4T", "5T", "6T",
        "4B", "5B", "6B",
        "4W", "5W", "6W",
        "5T", "5T"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["4W", "5W", "6W"] },
        { type: "chow", tiles: ["4T", "5T", "6T"] },
        { type: "chow", tiles: ["4B", "5B", "6B"] },
        { type: "chow", tiles: ["4W", "5W", "6W"] },
        { type: "pair", tiles: ["5T", "5T"] }
      ]
    }
  );
  assert.equal(allMiddle.some((fan) => fan.id === "QUAN_ZHONG"), true);
});

test("detectFans returns wind/dragon and same-rank pung fans", () => {
  const bigThreeWinds = detectFans(
    {
      tiles: [
        "E", "E", "E",
        "S", "S", "S",
        "Wn", "Wn", "Wn",
        "2W", "2W", "2W",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pung", tiles: ["S", "S", "S"] },
        { type: "pung", tiles: ["Wn", "Wn", "Wn"] },
        { type: "pung", tiles: ["2W", "2W", "2W"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(bigThreeWinds.some((fan) => fan.id === "DA_SAN_FENG"), true);

  const twoDragons = detectFans(
    {
      tiles: [
        "R", "R", "R",
        "G", "G", "G",
        "1W", "1W", "1W",
        "2T", "3T", "4T",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["R", "R", "R"] },
        { type: "pung", tiles: ["G", "G", "G"] },
        { type: "pung", tiles: ["1W", "1W", "1W"] },
        { type: "chow", tiles: ["2T", "3T", "4T"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(twoDragons.some((fan) => fan.id === "SHUANG_JIAN_KE"), true);

  const sameRankPungs = detectFans(
    {
      tiles: [
        "5W", "5W", "5W",
        "5T", "5T", "5T",
        "5B", "5B", "5B",
        "E", "E", "E",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["5W", "5W", "5W"] },
        { type: "pung", tiles: ["5T", "5T", "5T"] },
        { type: "pung", tiles: ["5B", "5B", "5B"] },
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(sameRankPungs.some((fan) => fan.id === "SAN_TONG_KE"), true);
  assert.equal(sameRankPungs.some((fan) => fan.id === "SHUANG_TONG_KE"), true);
});

test("detectFans supports structured special context fan ids", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "2W", "3W", "4W",
        "5W", "6W", "7W",
        "2T", "3T", "4T",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none",
      specialPattern: "qixing_bukao",
      rankZone: "upper",
      isChickenHand: true
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["1W", "1W", "1W"] },
        { type: "chow", tiles: ["2W", "3W", "4W"] },
        { type: "chow", tiles: ["5W", "6W", "7W"] },
        { type: "chow", tiles: ["2T", "3T", "4T"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  const expected = ["QI_XING_BU_KAO", "SHANG_SAN_PAI", "WU_FAN_HE"];
  for (const id of expected) {
    assert.equal(result.some((fan) => fan.id === id), true);
  }

  const mixedStraight = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "4T", "5T", "6T",
        "7B", "8B", "9B",
        "E", "E", "E",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none",
      specialPattern: "mixed_straight"
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["4T", "5T", "6T"] },
        { type: "chow", tiles: ["7B", "8B", "9B"] },
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(
    mixedStraight.some((fan) => fan.id === "SAN_SE_YI_TONG_SHUN"),
    true
  );
});

test("detectFans auto-detects advanced structure fans", () => {
  const nineGates = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "2W", "3W", "4W",
        "5W", "6W", "7W",
        "8W", "9W", "9W",
        "9W", "5W"
      ],
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none",
      advancedAuto: true
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "pung", tiles: ["1W", "1W", "1W"] },
        { type: "chow", tiles: ["2W", "3W", "4W"] },
        { type: "chow", tiles: ["5W", "6W", "7W"] },
        { type: "chow", tiles: ["8W", "9W", "7W"] },
        { type: "pair", tiles: ["9W", "9W"] }
      ]
    }
  );
  assert.equal(nineGates.some((fan) => fan.id === "JIU_LIAN_BAO_DENG"), true);

  const shiftedPairs = detectFans(
    {
      tiles: [
        "2W", "2W",
        "3W", "3W",
        "4W", "4W",
        "5W", "5W",
        "6W", "6W",
        "7W", "7W",
        "8W", "8W"
      ],
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "none",
      advancedAuto: true
    },
    { pattern: "seven_pairs", meldGroups: [] }
  );
  assert.equal(shiftedPairs.some((fan) => fan.id === "QI_LIAN_DUI"), true);

  const pureTripleChow = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "1W", "2W", "3W",
        "1W", "2W", "3W",
        "4T", "5T", "6T",
        "9B", "9B"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none",
      advancedAuto: true
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["4T", "5T", "6T"] },
        { type: "pair", tiles: ["9B", "9B"] }
      ]
    }
  );
  assert.equal(
    pureTripleChow.some((fan) => fan.id === "YI_SE_SAN_TONG_SHUN"),
    true
  );

  const fiveGates = detectFans(
    {
      tiles: [
        "1W", "2W", "3W",
        "1T", "2T", "3T",
        "1B", "2B", "3B",
        "E", "E", "E",
        "R", "R"
      ],
      winType: "dianhe",
      handState: "fulu",
      kongType: "none",
      timingEvent: "none",
      advancedAuto: true
    },
    {
      pattern: "standard",
      meldGroups: [
        { type: "chow", tiles: ["1W", "2W", "3W"] },
        { type: "chow", tiles: ["1T", "2T", "3T"] },
        { type: "chow", tiles: ["1B", "2B", "3B"] },
        { type: "pung", tiles: ["E", "E", "E"] },
        { type: "pair", tiles: ["R", "R"] }
      ]
    }
  );
  assert.equal(fiveGates.some((fan) => fan.id === "WU_MEN_QI"), true);
});

test("detectFans supports structured context detectors", () => {
  const result = detectFans(
    {
      tiles: [
        "1W", "1W", "1W",
        "2W", "3W", "4W",
        "5W", "6W", "7W",
        "2T", "3T", "4T",
        "9B", "9B"
      ],
      winType: "zimo",
      handState: "menqian",
      kongType: "none",
      timingEvent: "qianggang",
      kongSummary: { an: 2, ming: 1 },
      concealedPungCount: 3,
      noMeldClaims: true,
      lastTileOfKind: true,
      waitType: "single",
      flowerCount: 2
    },
    { pattern: "standard", meldGroups: [] }
  );
  const expected = [
    "QIANG_GANG_HU",
    "AN_GANG",
    "MING_GANG",
    "SHUANG_AN_GANG",
    "SAN_GANG",
    "SHUANG_AN_KE",
    "SAN_AN_KE",
    "BU_QIU_REN",
    "JUE_ZHANG",
    "DAN_DIAO_JIANG",
    "HUA_PAI"
  ];
  for (const id of expected) {
    assert.equal(result.some((fan) => fan.id === id), true);
  }
});
