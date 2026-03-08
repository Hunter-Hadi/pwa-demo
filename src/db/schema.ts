export interface Habit {
  id?: number;          // 自增主键
  title: string;        // 习惯名称
  icon: string;         // Emoji 或图标名
  frequency: 'daily';   // 目前仅支持每日
  created_at: number;   // 时间戳
  archived: 0 | 1;      // 软删除标记
}

export interface Log {
  id?: number;
  habit_id: number;     // 外键 -> Habit.id
  date: string;         // 格式 "YYYY-MM-DD" (作为索引)
  status: 1 | 0;        // 1: 完成, 0: 未完成 (默认不存0，只存1)
  timestamp: number;    // 打卡具体时间
}
