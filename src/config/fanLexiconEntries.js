/**
 * Purpose: Guobiao-aligned fan lexicon entries by registry id.
 * Description:
 * - Static copy for result UI; keys match FAN_REGISTRY.
 * - Text is a condensed paraphrase of 《中国麻将竞赛规则》番种表;
 *   authoritative wording is the official published rulebook.
 */
const FAN_LEXICON_BRIEF_ENTRIES = Object.freeze({
  MEN_QIAN_QING: "门前清：和牌时未进行过吃、碰或明杠，进张均为自摸。",
  ZI_MO: "自摸：和牌牌张为自己摸入，而非他人打出。",
  QI_DUI: "七对：由七个对子组成的特殊和型，计 24 番。",
  SHI_SAN_YAO: "十三幺：十三种幺九字各一张加其中一对作将，计 88 番。",
  QUAN_BU_KAO: "全不靠：由规定单张结构组成的特殊和型，计 12 番。",
  GANG_SHANG_HUA: "杠上开花：开杠后摸到的补牌即和牌，计 8 番。",
  MIAO_SHOU_HUI_CHUN: "妙手回春：自摸牌墙最后一张牌和牌，计 8 番。",
  HAI_DI_LAO_YUE: "海底捞月：和他人打出的最后一张牌，计 8 番。",
  QING_YI_SE: "清一色：和牌仅含一种序数花色，计 24 番。",
  HUN_YI_SE: "混一色：和牌仅一种序数花色加字牌，计 6 番。",
  DUAN_YAO: "断幺：和牌无幺九牌与字牌，计 2 番。",
  PENG_PENG_HU: "碰碰和：四组面子均为刻子（杠），计 6 番。",
  HUN_YAO_JIU: "混幺九：由幺九与字牌组成的特殊组合型，计 32 番。",
  ZI_YI_SE: "字一色：和牌全部为字牌，计 64 番。",
  QING_YAO_JIU: "清幺九：和牌全部为幺九序数牌，计 64 番。",
  QING_LONG: "清龙：同一花色 1—9 各出现一次的顺子组合，计 16 番。",
  PING_HU: "平和：四组顺子加一对将，且非自摸门清将非幺九，计 2 番。",
  YI_BAN_GAO: "一般高：两组完全相同的顺子，计 1 番。",
  SAN_SE_SAN_TONG_SHUN: "三色三同顺：三种花色各一组相同点数顺子，计 8 番。",
  MEN_FENG_KE: "门风刻：与自己座位门风相同的字刻，计 2 番。",
  QUAN_FENG_KE: "圈风刻：与当前圈风相同的字刻，计 2 番。",
  DA_SI_XI: "大四喜：东南西北四风字均为刻子或杠，计 88 番。",
  XIAO_SI_XI: "小四喜：三风刻加剩余一风作将，计 64 番。",
  DA_SAN_YUAN: "大三元：中发白均为刻子或杠，计 88 番。",
  XIAO_SAN_YUAN: "小三元：两箭刻加剩余箭牌作将，计 64 番。",
  HUA_LONG: "花龙：三种花色各一条 1—9 顺子相连成龙形，计 8 番。",
  XI_XIANG_FENG: "喜相逢：两种花色两组同数顺子，计 1 番。",
  LIAN_LIU: "连六：一种花色两组相连六张顺子，计 1 番。",
  LAO_SHAO_FU: "老少副：同时含 123 与 789 序数顺子，计 1 番。",
  QUE_YI_MEN: "缺一门：和牌缺一种序数花色，计 1 番。",
  WU_ZI: "无字：和牌无字牌，计 1 番。",
  SAN_SE_SAN_BU_GAO: "三色三步高：三色顺子点数依次递增一位，计 6 番。",
  YI_SE_SAN_BU_GAO: "一色三步高：同色三组顺子点数依次递增一位，计 16 番。",
  DA_YU_WU: "大于五：和牌仅由序数 6—9 组成，计 12 番。",
  XIAO_YU_WU: "小于五：和牌仅由序数 1—4 组成，计 12 番。",
  QUAN_DA: "全大：和牌序数牌均为 7—9，计 24 番。",
  QUAN_XIAO: "全小：和牌序数牌均为 1—3，计 24 番。",
  QUAN_ZHONG: "全中：和牌序数牌均为 4—6，计 24 番。",
  DA_SAN_FENG: "大三风：三种风字刻（或杠）加余下一风作将，计 12 番。",
  SHUANG_JIAN_KE: "双箭刻：中发白中两组为刻或杠，计 6 番。",
  SHUANG_TONG_KE: "双同刻：两种花色两组同点数刻子，计 2 番。",
  SAN_TONG_KE: "三同刻：三种花色三组同点数刻子，计 16 番。",
  LV_YI_SE: "绿一色：和牌仅由绿色系牌组成，计 88 番。",
  JIU_LIAN_BAO_DENG: "九莲宝灯：同色 1112345678999 型听九面，计 88 番。",
  SI_GANG: "四杠：和牌含四组杠，计 88 番。",
  QI_LIAN_DUI: "连七对：同色连续七个对子，计 88 番。",
  SI_AN_KE: "四暗刻：四组暗刻/暗杠加一对将，计 64 番。",
  YI_SE_SHUANG_LONG_HUI: "一色双龙会：同色两组老少副且同数将，计 64 番。",
  YI_SE_SI_TONG_SHUN: "一色四同顺：同色四组完全相同顺子，计 48 番。",
  YI_SE_SI_JIE_GAO: "一色四节高：同色四组刻子依次递增一，计 48 番。",
  YI_SE_SI_BU_GAO: "一色四步高：同色四组顺子点数依次递增，计 32 番。",
  SAN_GANG: "三杠：和牌含三组杠，计 32 番。",
  QI_XING_BU_KAO: "七星不靠：十三张不靠加七字，计 24 番。",
  ZU_HE_LONG: "组合龙：三色按 147/258/369 组合成特殊顺子结构，计 12 番。",
  QUAN_SHUANG_KE: "全双刻：刻子点数均为 2、4、6、8，计 24 番。",
  YI_SE_SAN_TONG_SHUN: "一色三同顺：同色三组完全相同顺子，计 24 番。",
  YI_SE_SAN_JIE_GAO: "一色三节高：同色三组刻子点数依次递增一，计 24 番。",
  TUI_BU_DAO: "推不倒：和牌仅由筒条中可倒置仍合法的牌组成，计 8 番。",
  SAN_SE_SAN_JIE_GAO: "三色三节高：三色刻子点数依次递增一，计 8 番。",
  WU_FAN_HE: "无番和：和牌不计任何其它番种时计 8 番。",
  QIANG_GANG_HU: "抢杠和：他人补杠时抢和该张，计 8 番。",
  SHUANG_AN_GANG: "双暗杠：两组暗杠，计 8 番。",
  QUAN_DAI_WU: "全带五：每组面子均含序数 5，计 16 番。",
  SAN_AN_KE: "三暗刻：三组暗刻，计 16 番。",
  WU_MEN_QI: "五门齐：万筒条字均有，计 6 番。",
  QUAN_QIU_REN: "全求人：副露后点和最后一张，计 6 番。",
  SHUANG_MING_GANG: "双明杠：两组明杠，计 4 番。",
  QUAN_DAI_YAO: "全带幺：每组顺刻杠及将均含幺九，计 4 番。",
  BU_QIU_REN: "不求人：无点和且无私杠，计 4 番。",
  AN_GANG: "暗杠：四张同牌暗扣成杠，计 2 番。",
  MING_GANG: "明杠：明面杠，计 1 番。",
  JUE_ZHANG: "和绝张：所和牌为该类牌的最后一次出现，计 4 番。",
  JIAN_KE: "箭刻：中发白字刻或杠，计 2 番。",
  YAO_JIU_KE: "幺九刻：幺九序数或风字刻/杠，计 1 番。",
  BIAN_ZHANG: "边张：听 12 胡 3 或听 89 胡 7 的边张和，计 1 番。",
  KAN_ZHANG: "坎张：听两面夹张之一成和，计 1 番。",
  DAN_DIAO_JIANG: "单钓将：仅听一张作将成和，计 1 番。",
  HUA_PAI: "花牌：每花 1 番，不计入 14 张；在和牌条件中填花数。",
  SHUANG_AN_KE: "双暗刻：两组暗刻，计 2 番。",
  SI_GUI_YI:
    "四归一：四张相同牌分在顺、刻、将中（杠不计），计 2 番。",
  SAN_SE_SHUANG_LONG_HUI: "三色双龙会：三色两组老少副且 5 作将，计 16 番。",
});

const EXAMPLE_BY_FAN_ID = Object.freeze({
  MEN_QIAN_QING: "示例：全程不吃不碰不明杠，最后自摸和牌。",
  ZI_MO: "示例：自己摸进和牌张后和牌，不是点和。",
  QI_DUI: "示例：11万 22万 33条 44条 55筒 66筒 东东。",
  SHI_SAN_YAO: "示例：19万19条19筒 东南西北 中发白 + 任一幺九字对子。",
  QUAN_BU_KAO: "示例：按全不靠结构成手，单张互不连靠后和牌。",
  GANG_SHANG_HUA: "示例：补杠后摸补牌，补牌即和。",
  MIAO_SHOU_HUI_CHUN: "示例：摸到牌墙最后一张并和牌。",
  HAI_DI_LAO_YUE: "示例：他家打出最后一张牌，你点和。",
  QING_YI_SE: "示例：全是万子，如 123万 456万 789万 111万 + 22万。",
  HUN_YI_SE: "示例：万子配字牌，如 123万 456万 东东东 + 55万。",
  DUAN_YAO: "示例：只由 2-8 序数牌组成，不含 1/9 与字牌。",
  PENG_PENG_HU: "示例：111万 999条 东东东 白白白 + 55筒。",
  HUN_YAO_JIU: "示例：面子都围绕幺九牌与字牌组合成和。",
  ZI_YI_SE: "示例：东东东 南南南 西西西 中中中 + 白白。",
  QING_YAO_JIU: "示例：111万 999万 111条 999条 + 11筒。",
  QING_LONG: "示例：同色同时有 123、456、789 三组顺子。",
  PING_HU: "示例：四组顺子+将，且为平和有效听型后和牌。",
  YI_BAN_GAO: "示例：同花色两组相同顺子，如 345万 + 345万。",
  SAN_SE_SAN_TONG_SHUN: "示例：123万 + 123条 + 123筒。",
  MEN_FENG_KE: "示例：你坐南位，手中有南南南刻。",
  QUAN_FENG_KE: "示例：东圈时，手中有东东东刻。",
  DA_SI_XI: "示例：东南西北四风全部成刻/杠。",
  XIAO_SI_XI: "示例：东东东 南南南 西西西 + 北北将。",
  DA_SAN_YUAN: "示例：中中中 发发发 白白白。",
  XIAO_SAN_YUAN: "示例：中中中 发发发 + 白白将。",
  HUA_LONG: "示例：123万 + 456条 + 789筒。",
  XI_XIANG_FENG: "示例：两种花色同数顺子，如 456万 + 456条。",
  LIAN_LIU: "示例：同色连六，如 123万 + 456万。",
  LAO_SHAO_FU: "示例：同色同时出现 123 与 789。",
  QUE_YI_MEN: "示例：只用万、条两门和牌，缺筒门。",
  WU_ZI: "示例：和牌牌型中完全没有字牌。",
  SAN_SE_SAN_BU_GAO: "示例：123万 + 234条 + 345筒。",
  YI_SE_SAN_BU_GAO: "示例：123万 + 234万 + 345万。",
  DA_YU_WU: "示例：全手序数牌都在 6-9 区间。",
  XIAO_YU_WU: "示例：全手序数牌都在 1-4 区间。",
  QUAN_DA: "示例：序数牌只用 7、8、9 组成和牌。",
  QUAN_XIAO: "示例：序数牌只用 1、2、3 组成和牌。",
  QUAN_ZHONG: "示例：序数牌只用 4、5、6 组成和牌。",
  DA_SAN_FENG: "示例：东东东 南南南 西西西 + 北北将。",
  SHUANG_JIAN_KE: "示例：中中中 + 发发发（或白刻）同手出现。",
  SHUANG_TONG_KE: "示例：555万 + 555条。",
  SAN_TONG_KE: "示例：777万 + 777条 + 777筒。",
  LV_YI_SE: "示例：仅用可构成绿一色的牌（如发与绿色条牌）和牌。",
  JIU_LIAN_BAO_DENG: "示例：同色 1112345678999 基础上听任一同色牌和。",
  SI_GANG: "示例：手牌中形成四组杠后和牌。",
  QI_LIAN_DUI: "示例：11万22万33万44万55万66万77万。",
  SI_AN_KE: "示例：四组暗刻（或暗杠）+一对将成和。",
  YI_SE_SHUANG_LONG_HUI: "示例：同色 123+789 各两组，并以 55 作将。",
  YI_SE_SI_TONG_SHUN: "示例：同色四组相同顺子，如四组 234万。",
  YI_SE_SI_JIE_GAO: "示例：同色刻子 333万444万555万666万。",
  YI_SE_SI_BU_GAO: "示例：同色顺子 123万234万345万456万。",
  SAN_GANG: "示例：形成三组杠并满足和牌。",
  QI_XING_BU_KAO: "示例：七字齐全并按不靠结构成手后和牌。",
  ZU_HE_LONG: "示例：147万 + 258条 + 369筒并满足和牌结构。",
  QUAN_SHUANG_KE: "示例：刻子都为双数，如 222万 444条 666筒 888万。",
  YI_SE_SAN_TONG_SHUN: "示例：同色三组相同顺子，如三组 456条。",
  YI_SE_SAN_JIE_GAO: "示例：同色刻子依次递增，如 444筒 555筒 666筒。",
  TUI_BU_DAO: "示例：仅用推不倒允许牌张组成和牌。",
  SAN_SE_SAN_JIE_GAO: "示例：333万 + 444条 + 555筒。",
  WU_FAN_HE: "示例：和牌后没有任何其他番可计时，记无番和。",
  QIANG_GANG_HU: "示例：他家加杠时，你抢这张牌和。",
  SHUANG_AN_GANG: "示例：同一手内有两组暗杠并和牌。",
  QUAN_DAI_WU: "示例：每组面子与将都含数字 5。",
  SAN_AN_KE: "示例：有三组暗刻并满足和牌。",
  WU_MEN_QI: "示例：万、条、筒、风、箭五类牌都出现。",
  QUAN_QIU_REN: "示例：高度副露，最后靠点和完成和牌。",
  SHUANG_MING_GANG: "示例：同手出现两组明杠。",
  QUAN_DAI_YAO: "示例：每组顺刻杠与将都带幺九属性。",
  BU_QIU_REN: "示例：不吃不碰并自力和牌（按规则口径计）。",
  AN_GANG: "示例：手中四张同牌暗扣成杠。",
  MING_GANG: "示例：碰后补杠或直接明杠成组。",
  JUE_ZHANG: "示例：和到该牌最后可用一张（绝张）。",
  JIAN_KE: "示例：中中中（或发发发、白白白）成刻。",
  YAO_JIU_KE: "示例：111万（或999条、风刻）成刻后计入。",
  BIAN_ZHANG: "示例：12万听3，或89条听7成和。",
  KAN_ZHANG: "示例：46筒听5筒成和。",
  DAN_DIAO_JIANG: "示例：仅听一张将牌，如只等白板成将。",
  HUA_PAI: "示例：和牌时有2张花牌，额外加2番。",
  SHUANG_AN_KE: "示例：同手有两组暗刻并和牌。",
  SI_GUI_YI: "示例：四张同牌分散在顺、刻、将中（非杠）后计入。",
  SAN_SE_SHUANG_LONG_HUI: "示例：三色双龙结构齐全并以5作将后和牌。"
});

/**
 * @param {string} id
 * @param {string} brief
 * @returns {{
 *   brief: string,
 *   criteria: string[],
 *   pitfalls: string[],
 *   example: string
 * }}
 */
function buildFourBlockEntry(id, brief) {
  const text = String(brief || "");
  const fanName = text.split("：")[0] || "该番种";
  const concreteExample = EXAMPLE_BY_FAN_ID[id]
    || `示例：满足${fanName}判定后即可计入该番。`;
  return {
    brief: text,
    criteria: [
      "和牌时需满足该番种定义的牌型结构或时机条件。",
      "若存在不计/互斥关系，按国标不计原则处理。"
    ],
    pitfalls: [
      "只看牌面相似而忽略触发条件，导致误判。",
      "与近似番种重复计分，未先做不计检查。"
    ],
    example: concreteExample
  };
}

export const FAN_LEXICON_ENTRIES = Object.freeze(
  Object.fromEntries(
    Object.entries(FAN_LEXICON_BRIEF_ENTRIES).map(([id, brief]) => [
      id,
      buildFourBlockEntry(id, brief)
    ])
  )
);
