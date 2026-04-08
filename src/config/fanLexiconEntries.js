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

const DETAIL_BY_FAN_ID = Object.freeze({
  MEN_QIAN_QING: {
    criteria: ["和牌前未吃、碰、明杠。", "门前状态保持到和牌时点。"],
    pitfalls: ["做过副露后仍误记门前清。", "把门前清与自摸当成同一番。"]
  },
  ZI_MO: {
    criteria: ["和牌张必须由自己摸入。", "不是他家打出的点和。"],
    pitfalls: ["点和误标为自摸。", "先点和后又勾选自摸条件。"]
  },
  QI_DUI: {
    criteria: ["牌型为七个对子。", "不能按四面子一将计型。"],
    pitfalls: ["出现刻子却仍按七对计。", "对子不足七组仍误判。"]
  },
  SHI_SAN_YAO: {
    criteria: ["13种幺九字齐全，另有一张作将。", "结构必须是十三幺专属型。"],
    pitfalls: ["缺少某个幺九字仍误算。", "把普通混幺九误当十三幺。"]
  },
  QUAN_BU_KAO: {
    criteria: ["单张之间不连不靠。", "满足全不靠规定牌张结构。"],
    pitfalls: ["有可连顺关系仍记全不靠。", "把七星不靠与全不靠混用。"]
  },
  GANG_SHANG_HUA: {
    criteria: ["在开杠补牌阶段和牌。", "和牌张是补牌而非普通摸牌。"],
    pitfalls: ["普通自摸误记杠上开花。", "非补牌时点和仍误记。"]
  },
  MIAO_SHOU_HUI_CHUN: {
    criteria: ["和牌张为牌墙最后一张自摸。", "必须是自摸末张。"],
    pitfalls: ["最后一张点和误记妙手。", "末张判定时点错误。"]
  },
  HAI_DI_LAO_YUE: {
    criteria: ["和牌张为别人打出的最后一张。", "属于点和末张场景。"],
    pitfalls: ["最后一张自摸误记海底。", "非末张点和误算海底。"]
  },
  QING_YI_SE: {
    criteria: ["全手仅一种序数花色。", "不得夹入字牌或他色序数牌。"],
    pitfalls: ["混入字牌仍按清一色。", "跨两门序数牌未发现。"]
  },
  HUN_YI_SE: {
    criteria: ["一种序数花色+字牌。", "不能出现第二种序数花色。"],
    pitfalls: ["两门序数牌仍误计混一色。", "无字牌时与清一色混淆。"]
  },
  DUAN_YAO: {
    criteria: ["全手无1、9和字牌。", "所有面子与将均为中张。"],
    pitfalls: ["含1/9仍误记断幺。", "含风箭牌未剔除。"]
  },
  PENG_PENG_HU: {
    criteria: ["四组面子都为刻子或杠。", "不得含顺子面子。"],
    pitfalls: ["有顺子却误记碰碰和。", "把双同刻直接当碰碰和。"]
  },
  HUN_YAO_JIU: {
    criteria: ["由幺九牌与字牌构成。", "整体结构符合混幺九定义。"],
    pitfalls: ["掺入中张仍误算。", "与全带幺概念混淆。"]
  },
  ZI_YI_SE: {
    criteria: ["全手均为字牌。", "不得出现序数牌。"],
    pitfalls: ["出现序数牌仍误算字一色。", "和混一色混为一谈。"]
  },
  QING_YAO_JIU: {
    criteria: ["全为1或9序数牌。", "不得含字牌与中张。"],
    pitfalls: ["出现中张仍误算。", "含字牌误判为清幺九。"]
  },
  QING_LONG: {
    criteria: ["同色含123、456、789三顺。", "龙形三顺须同一花色。"],
    pitfalls: ["跨花色三顺误记清龙。", "缺一段顺子仍误算。"]
  },
  PING_HU: {
    criteria: ["四顺子+一将的平和结构。", "听型需满足平和要求。"],
    pitfalls: ["将位或听型不符仍误算。", "含刻子后仍记平和。"]
  },
  YI_BAN_GAO: {
    criteria: ["两组完全相同顺子。", "同花色同起点。"],
    pitfalls: ["只同点不同花误算。", "顺子重叠识别错误。"]
  },
  SAN_SE_SAN_TONG_SHUN: {
    criteria: ["三色各有一组同数顺子。", "万条筒三门齐备。"],
    pitfalls: ["只有两色却误记三色。", "顺子起点不一致。"]
  },
  MEN_FENG_KE: {
    criteria: ["自己门风牌成刻/杠。", "门风须与座位一致。"],
    pitfalls: ["把圈风当门风。", "仅对子误记门风刻。"]
  },
  QUAN_FENG_KE: {
    criteria: ["圈风牌成刻/杠。", "圈风须与当前局风一致。"],
    pitfalls: ["把门风刻误记圈风刻。", "圈风未更新导致误判。"]
  },
  DA_SI_XI: {
    criteria: ["东南西北四风全刻/杠。", "四风都需成组。"],
    pitfalls: ["缺一风仍误算大四喜。", "小四喜误记为大四喜。"]
  },
  XIAO_SI_XI: {
    criteria: ["三风刻/杠+一风将。", "四风均出现。"],
    pitfalls: ["将牌不是风牌仍误记。", "仅两风刻时误算。"]
  },
  DA_SAN_YUAN: {
    criteria: ["中发白三箭全刻/杠。", "三箭都需成组。"],
    pitfalls: ["少一箭刻仍误算。", "小三元误记大三元。"]
  },
  XIAO_SAN_YUAN: {
    criteria: ["两箭刻/杠+一箭将。", "中发白需三者齐现。"],
    pitfalls: ["将牌非箭牌仍误记。", "三箭全刻时应转大三元。"]
  },
  HUA_LONG: {
    criteria: ["三色拼成123/456/789龙形。", "三段顺子连贯覆盖1-9。"],
    pitfalls: ["顺子断档仍误算。", "同色龙误记花龙。"]
  },
  XI_XIANG_FENG: {
    criteria: ["两色两组同数顺子。", "顺子起点一致。"],
    pitfalls: ["仅同花不同数误记。", "把一般高混入喜相逢。"]
  },
  LIAN_LIU: {
    criteria: ["同色两顺相连六张。", "如123与456同色。"],
    pitfalls: ["跨色相连误记。", "非连续两顺仍误算。"]
  },
  LAO_SHAO_FU: {
    criteria: ["同色同时含123与789。", "需同花色成对出现。"],
    pitfalls: ["跨色老少副误判。", "缺一端顺子仍误算。"]
  },
  QUE_YI_MEN: {
    criteria: ["万条筒缺一门。", "其余两门可正常组合。"],
    pitfalls: ["三门齐全仍误记缺一门。", "把无字错当缺一门。"]
  },
  WU_ZI: {
    criteria: ["和牌中没有字牌。", "仅万条筒参与。"],
    pitfalls: ["出现风箭仍误算无字。", "把缺一门误记无字。"]
  },
  SAN_SE_SAN_BU_GAO: {
    criteria: ["三色顺子依次步进。", "三组起点按+1递增。"],
    pitfalls: ["步进不连续仍误算。", "同色步高误记三色步高。"]
  },
  YI_SE_SAN_BU_GAO: {
    criteria: ["同色三组顺子步进。", "起点按+1递增。"],
    pitfalls: ["跨色顺子误算一色步高。", "步进跨度错误。"]
  },
  DA_YU_WU: {
    criteria: ["序数牌仅6-9。", "不得出现1-5与字牌违例。"],
    pitfalls: ["出现5及以下仍误算。", "把全大和大于五混淆。"]
  },
  XIAO_YU_WU: {
    criteria: ["序数牌仅1-4。", "不得出现5-9与字牌违例。"],
    pitfalls: ["出现5及以上仍误算。", "把全小和小于五混淆。"]
  },
  QUAN_DA: {
    criteria: ["序数牌都在7-9。", "结构中不含低位序数牌。"],
    pitfalls: ["出现6及以下仍误算。", "与大于五混淆。"]
  },
  QUAN_XIAO: {
    criteria: ["序数牌都在1-3。", "结构中不含中高位序数牌。"],
    pitfalls: ["出现4及以上仍误算。", "与小于五混淆。"]
  },
  QUAN_ZHONG: {
    criteria: ["序数牌都在4-6。", "结构中不含1-3或7-9。"],
    pitfalls: ["出现边张数牌仍误算。", "与断幺误混。"]
  },
  DA_SAN_FENG: {
    criteria: ["三风刻/杠+另一风将。", "四风必须全部出现。"],
    pitfalls: ["将牌非风仍误算。", "两风刻就误记大三风。"]
  },
  SHUANG_JIAN_KE: {
    criteria: ["中发白中两组成刻/杠。", "至少两箭成组。"],
    pitfalls: ["只有一箭刻仍误算。", "把大/小三元重复计分。"]
  },
  SHUANG_TONG_KE: {
    criteria: ["两色同点数刻子。", "点数与刻型都要一致。"],
    pitfalls: ["同色双刻误记双同刻。", "点数不同仍误算。"]
  },
  SAN_TONG_KE: {
    criteria: ["三色同点数刻子齐全。", "万条筒三门同点同刻。"],
    pitfalls: ["缺一色仍误算。", "点数不一致未排除。"]
  },
  LV_YI_SE: {
    criteria: ["仅用绿一色允许牌张。", "牌池必须满足绿牌集合。"],
    pitfalls: ["混入非绿牌仍误算。", "只看颜色忽略牌种约束。"]
  },
  JIU_LIAN_BAO_DENG: {
    criteria: ["同色1112345678999基础。", "听型满足九莲宝灯要求。"],
    pitfalls: ["基础牌型不全仍误算。", "跨色同形误判。"]
  },
  SI_GANG: {
    criteria: ["和牌时共四组杠。", "杠数须准确统计。"],
    pitfalls: ["三杠误记四杠。", "把刻子误算杠组。"]
  },
  QI_LIAN_DUI: {
    criteria: ["同色连续七个对子。", "对子须连续且同花色。"],
    pitfalls: ["非连续对子仍误算。", "跨色七对误记连七对。"]
  },
  SI_AN_KE: {
    criteria: ["四组暗刻/暗杠。", "暗组来源须成立。"],
    pitfalls: ["明刻混入仍误算。", "暗刻数量不足四组。"]
  },
  YI_SE_SHUANG_LONG_HUI: {
    criteria: ["同色两组123与789且5作将。", "双龙结构与将位同时满足。"],
    pitfalls: ["将牌非5仍误算。", "缺少双龙段仍误记。"]
  },
  YI_SE_SI_TONG_SHUN: {
    criteria: ["同色四组完全相同顺子。", "四组顺子起点一致。"],
    pitfalls: ["只有三组同顺仍误算。", "混入节高分解重复计。"]
  },
  YI_SE_SI_JIE_GAO: {
    criteria: ["同色四组刻子点数递增1。", "四节刻连续上升。"],
    pitfalls: ["点数跳档仍误算。", "同顺结构误记节高。"]
  },
  YI_SE_SI_BU_GAO: {
    criteria: ["同色四组顺子步进递增。", "四步顺子连续推进。"],
    pitfalls: ["步进断裂仍误算。", "跨色步高误记一色。"]
  },
  SAN_GANG: {
    criteria: ["和牌时有三组杠。", "杠来源与数量都要成立。"],
    pitfalls: ["两杠或四杠混算。", "杠型统计遗漏。"]
  },
  QI_XING_BU_KAO: {
    criteria: ["七字齐全并满足不靠。", "结构需符合七星不靠专型。"],
    pitfalls: ["缺字牌仍误算。", "与全不靠边界混淆。"]
  },
  ZU_HE_LONG: {
    criteria: ["三色147/258/369组合。", "组合龙结构与和牌并存。"],
    pitfalls: ["组合不完整仍误算。", "把花龙误作组合龙。"]
  },
  QUAN_SHUANG_KE: {
    criteria: ["刻子点数均为双数。", "2/4/6/8刻组覆盖成型。"],
    pitfalls: ["含奇数刻仍误算。", "顺子混入仍误记。"]
  },
  YI_SE_SAN_TONG_SHUN: {
    criteria: ["同色三组相同顺子。", "三组顺子起点一致。"],
    pitfalls: ["两组同顺也误算。", "跨色同顺误判。"]
  },
  YI_SE_SAN_JIE_GAO: {
    criteria: ["同色三组刻子递增1。", "三节刻点数连续。"],
    pitfalls: ["点数不连仍误算。", "同顺结构误记节高。"]
  },
  TUI_BU_DAO: {
    criteria: ["仅使用推不倒允许牌。", "牌池限制必须满足。"],
    pitfalls: ["混入禁用牌仍误算。", "只看外形忽略牌值规则。"]
  },
  SAN_SE_SAN_JIE_GAO: {
    criteria: ["三色刻子点数递增。", "三门刻组需按步进排列。"],
    pitfalls: ["三门不齐仍误算。", "点数顺序错误。"]
  },
  WU_FAN_HE: {
    criteria: ["无其他番可计时成立。", "须先排除全部可计番。"],
    pitfalls: ["已有番仍误记无番和。", "门槛逻辑未先校验。"]
  },
  QIANG_GANG_HU: {
    criteria: ["抢他家补杠牌和牌。", "时机必须发生在加杠瞬间。"],
    pitfalls: ["普通点和误记抢杠和。", "非补杠时机误算。"]
  },
  SHUANG_AN_GANG: {
    criteria: ["同手有两组暗杠。", "暗杠判定与数量都成立。"],
    pitfalls: ["明杠混入仍误算。", "仅一组暗杠却误记双暗杠。"]
  },
  QUAN_DAI_WU: {
    criteria: ["每组面子与将都含5。", "任何一组不含5即不成立。"],
    pitfalls: ["只多数含5就误算。", "将牌不含5未排除。"]
  },
  SAN_AN_KE: {
    criteria: ["至少三组暗刻成立。", "暗组来源须明确。"],
    pitfalls: ["明刻计入暗刻。", "暗刻数量不足三组。"]
  },
  WU_MEN_QI: {
    criteria: ["万条筒风箭五门齐。", "五类牌都需出现。"],
    pitfalls: ["缺任一门仍误算。", "把花牌当作门类。"]
  },
  QUAN_QIU_REN: {
    criteria: ["副露为主并以点和完成。", "最后一张依赖他家打牌。"],
    pitfalls: ["自摸误记全求人。", "门前手误算全求人。"]
  },
  SHUANG_MING_GANG: {
    criteria: ["同手有两组明杠。", "明杠数量准确为两组。"],
    pitfalls: ["暗杠计入明杠。", "只有一组明杠仍误算。"]
  },
  QUAN_DAI_YAO: {
    criteria: ["每组面子与将都含幺九。", "任一组不带幺九即失效。"],
    pitfalls: ["个别组不带幺九仍误算。", "与混幺九混淆。"]
  },
  BU_QIU_REN: {
    criteria: ["不依赖点和完成和牌。", "不以求人方式成和。"],
    pitfalls: ["点和后仍误记不求人。", "副露行为与口径冲突。"]
  },
  AN_GANG: {
    criteria: ["四张同牌暗扣成杠。", "未明示给他家前即成立。"],
    pitfalls: ["明杠误算暗杠。", "三张同牌误记为杠。"]
  },
  MING_GANG: {
    criteria: ["明示形成的杠组。", "来源可为直杠或补杠。"],
    pitfalls: ["暗杠误记明杠。", "碰牌未补成杠就计分。"]
  },
  JUE_ZHANG: {
    criteria: ["和到该牌最后可用一张。", "需满足绝张场景。"],
    pitfalls: ["非绝张环境误算。", "可见牌计数错误。"]
  },
  JIAN_KE: {
    criteria: ["中发白任一成刻/杠。", "箭牌必须成组。"],
    pitfalls: ["箭牌对子误记箭刻。", "与双箭刻重复计分。"]
  },
  YAO_JIU_KE: {
    criteria: ["1/9或风牌成刻/杠。", "刻组属性需为幺九类。"],
    pitfalls: ["中张刻误记幺九刻。", "与大牌番重复计入。"]
  },
  BIAN_ZHANG: {
    criteria: ["听12和3或听89和7。", "听型必须是边张。"],
    pitfalls: ["两面听误记边张。", "中洞听误记边张。"]
  },
  KAN_ZHANG: {
    criteria: ["听夹张中张成和。", "听型为坎张而非两面。"],
    pitfalls: ["两面听误记坎张。", "边张听混入坎张。"]
  },
  DAN_DIAO_JIANG: {
    criteria: ["仅听一张将牌。", "和牌张用于成将。"],
    pitfalls: ["听面子牌却误记单钓将。", "多面听误判单钓。"]
  },
  HUA_PAI: {
    criteria: ["按花牌张数逐张计番。", "花牌不计入14张结构。"],
    pitfalls: ["把花牌并入手牌结构。", "花牌张数录入错误。"]
  },
  SHUANG_AN_KE: {
    criteria: ["两组暗刻成立。", "暗刻来源须清晰。"],
    pitfalls: ["明刻混入暗刻。", "只有一组暗刻仍误算。"]
  },
  SI_GUI_YI: {
    criteria: ["四张同牌分散在顺刻将中。", "杠组不计入四归一。"],
    pitfalls: ["把杠当四归一来源。", "四张同牌未分散仍误算。"]
  },
  SAN_SE_SHUANG_LONG_HUI: {
    criteria: ["三色双龙结构且5作将。", "龙段与将位同时满足。"],
    pitfalls: ["将位不是5仍误算。", "只成双龙未成三色仍误判。"]
  }
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
  const detail = DETAIL_BY_FAN_ID[id];
  const concreteExample = EXAMPLE_BY_FAN_ID[id]
    || `示例：满足${fanName}判定后即可计入该番。`;
  return {
    brief: text,
    criteria: detail?.criteria || [`请按${fanName}定义核对牌型条件。`],
    pitfalls: detail?.pitfalls || [`避免把${fanName}与相近番种重复计分。`],
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
