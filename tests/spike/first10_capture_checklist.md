<!--
Purpose: Define a practical capture checklist for the first 10 DeepSeek VLM spike samples.
Author: Luke WU
-->

# First 10 Sample Capture Checklist / 首批10张样本拍摄清单

Use this checklist before running.  
在执行前请先按此清单检查。

```bash
DEEPSEEK_API_KEY=your_key npm run spike:vlm -- /absolute/path/to/image.jpg
```

## Capture plan (10 photos) / 拍摄计划（10张）

1. Bright light, near-top-down angle, no occlusion. / 强光，接近俯拍，无遮挡。  
2. Bright light, slight left tilt. / 强光，轻微左倾。  
3. Bright light, slight right tilt. / 强光，轻微右倾。  
4. Medium light, near-top-down. / 中等光照，接近俯拍。  
5. Medium light, mild glare. / 中等光照，轻微反光。  
6. Warm indoor light, near-top-down. / 暖色室内光，接近俯拍。  
7. Cool indoor light, near-top-down. / 冷色室内光，接近俯拍。  
8. Slight shadow crossing 2-3 tiles. / 有轻微阴影跨过2-3张牌。  
9. Lower light but still readable. / 较低光照但仍清晰可辨。  
10. Realistic mixed lighting, minor perspective distortion. / 真实混合光，轻微透视变形。  

## Per-photo checks / 每张照片检查项

- Exactly one player's 14 tiles in frame. / 画面内仅包含一位玩家的14张手牌。  
- Tile faces readable by a human reviewer. / 人工复核时牌面清晰可读。  
- No fingers covering tile faces. / 不要有手指遮挡牌面。  
- Save using stable filename like `sample_01.jpg` ... `sample_10.jpg`. / 使用固定命名，如 `sample_01.jpg` 到 `sample_10.jpg`。  
- Record each run in `tests/spike/first10_eval_template.csv`. / 每次识别结果都记录到 `tests/spike/first10_eval_template.csv`。  

## Minimum acceptance for this first batch / 首批最小验收标准

- `tiles.length` is 14 for at least 9/10 photos. / 至少 9/10 的样本返回 `tiles.length = 14`。  
- No invalid tile codes in model output. / 模型输出中不得出现非法牌码。  
- At least 6/10 hands are fully correct without manual correction. / 至少 6/10 可在不人工纠错时完全正确。  
- At least 9/10 become usable after correcting uncertain indices. / 至少 9/10 在修正不确定索引后可用于后续计番。  
