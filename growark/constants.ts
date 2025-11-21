
import { PointPreset, ScoreCategory } from "./types";

export const POINT_PRESETS: PointPreset[] = [
  // I. 学习成果与高价值奖励
  { label: '正式测试高分奖 (95分及以上)', value: 1000, category: ScoreCategory.ONE },
  { label: '正式测试满分奖 (100分)', value: 5000, category: ScoreCategory.ONE },
  { label: '重大检测全对 (学校听写/默写)', value: 100, category: ScoreCategory.ONE },
  { label: '基础过关检测 (每项)', value: 10, category: ScoreCategory.ONE },
  { label: '连续成就挑战 (连续5天全对)', value: 550, category: ScoreCategory.ONE },
  { label: '课外拓展完成 (语文)', value: 5, category: ScoreCategory.ONE },
  { label: '课外拓展完成 (数学)', value: 5, category: ScoreCategory.ONE },

  // II. 自主管理与习惯养成 (午托篇)
  { label: '按时安静回校 (12:15前)', value: 5, category: ScoreCategory.TWO },
  { label: '午餐管理 (有序/不挑食/光盘)', value: 5, category: ScoreCategory.TWO },
  { label: '午间阅读 (安静/完成计划)', value: 5, category: ScoreCategory.TWO },
  { label: '安静午休 (自助午休)', value: 5, category: ScoreCategory.TWO },
  { label: '离校准备 (叠被/卫生/排队)', value: 5, category: ScoreCategory.TWO },

  // III. 自主管理与学习过程 (晚辅篇)
  { label: '自主登记与计划', value: 10, category: ScoreCategory.THREE },
  { label: '自主检查核对 (按标准)', value: 10, category: ScoreCategory.THREE },
  { label: '主动改错问询 (无需催促)', value: 10, category: ScoreCategory.THREE },
  { label: '复盘整理 (分析原因)', value: 10, category: ScoreCategory.THREE },

  // IV. 学习效率与时间管理
  { label: '在学校完成作业', value: 10, category: ScoreCategory.FOUR },
  { label: '晚托30分钟内完成作业', value: 10, category: ScoreCategory.FOUR },
  { label: '19:30前结束所有学习任务', value: 20, category: ScoreCategory.FOUR },

  // V. 质量、进步与整理
  { label: '卷面加分 (整洁规范)', value: 10, category: ScoreCategory.FIVE },
  { label: '进步加分 (任一方面)', value: 10, category: ScoreCategory.FIVE },
  { label: '纪律良好 (正式上课)', value: 10, category: ScoreCategory.FIVE },
  { label: '离校卫生整理', value: 10, category: ScoreCategory.FIVE },

  // VI. 纪律与惩罚细则
  { label: '一般违纪 (经提醒后仍不遵守)', value: -50, category: ScoreCategory.SIX },
  { label: '严重违纪 (擅自离教室)', value: -100, category: ScoreCategory.SIX },
  { label: '恶意严重违纪 (清零当日)', value: -9999, category: ScoreCategory.SIX },
];

export const BADGE_ICONS = [
  '⭐', '🏆', '🚀', '🎨', '📚', '💡', '🏃', '🌞', '🦁', '🐯', '🦊'
];

export const HABIT_ICONS = [
  '📝', '📖', '🧹', '🥛', '🏃‍♂️', '🎹', '🧠', '🗣️', '🤝', '🍽️', '🛌'
];