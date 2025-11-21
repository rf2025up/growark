import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 28个学生的ID (1-28)
const STUDENT_IDS = Array.from({ length: 28 }, (_, i) => String(i + 1));

// 团队ID
const TEAMS = ['1', '2', '3', '4'];

// 勋章列表
const BADGES = [
  { id: 'b1', name: '学霸之星', icon: '⭐', description: '学习表现突出' },
  { id: 'b2', name: '挑战先锋', icon: '🛡️', description: '完成挑战最多' },
  { id: 'b3', name: '阅读达人', icon: '📖', description: '阅读书籍超过5本' },
  { id: 'b4', name: '全勤奖', icon: '🏃', description: '本月无缺席' },
  { id: 'b5', name: '进步之星', icon: '🚀', description: '本周进步最大' },
  { id: 'b6', name: '小画家', icon: '🎨', description: '美术课表现优异' },
  { id: 'b7', name: '小科学家', icon: '💡', description: '科学实验动手能力强' },
  { id: 'b8', name: '体育健将', icon: '⚽', description: '运动能力突出' },
  { id: 'b9', name: '音乐小天才', icon: '🎵', description: '音乐素养优秀' }
];

// 习惯列表
const HABITS = [
  { id: 'h1', name: '按时回校', icon: '🕐' },
  { id: 'h2', name: '午餐管理', icon: '🍽️' },
  { id: 'h3', name: '午间阅读', icon: '📖' },
  { id: 'h4', name: '安静午休', icon: '😴' },
  { id: 'h5', name: '离校整理', icon: '🧹' },
  { id: 'h6', name: '自主登记', icon: '✍️' },
  { id: 'h7', name: '主动改错', icon: '✏️' },
  { id: 'h8', name: '复盘整理', icon: '📊' },
  { id: 'h9', name: '卷面整洁', icon: '📝' }
];

// 获取随机元素
const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 生成随机日期（最近7天内）
const randomRecentDate = () => {
  const days = Math.floor(Math.random() * 7);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
};

// 生成PK主题
const generatePKTopic = () => {
  const topics = [
    '背诵古诗《静夜思》',
    '速算比赛 20道题',
    '单词拼写 10个',
    '跳绳比赛 1分钟',
    '成语接龙',
    '英语对话练习',
    '数学应用题',
    '科学知识问答',
    '书法展示',
    '绘画比赛'
  ];
  return randomPick(topics);
};

// 生成挑战标题和描述
const generateChallenge = () => {
  const challenges = [
    { title: '每日口语评测', desc: '完成每日英语跟读打卡', rewardPoints: 5, rewardExp: 10 },
    { title: '班级训练营', desc: '连续一周保持桌面整洁', rewardPoints: 10, rewardExp: 20 },
    { title: '阅读马拉松', desc: '一周阅读两本书', rewardPoints: 20, rewardExp: 40 },
    { title: '数学计算提速', desc: '每天完成50道速算题', rewardPoints: 15, rewardExp: 30 },
    { title: '科学探索', desc: '完成一个科学小实验', rewardPoints: 25, rewardExp: 50 }
  ];
  return randomPick(challenges);
};

// 生成习惯打卡
const generateHabitCheckIn = () => {
  return randomPick(HABITS);
};

// 生成经验值 (50-500)
const generateExp = () => Math.floor(Math.random() * 450) + 50;

// 生成积分 (-50 到 100)
const generatePoints = () => {
  const isPositive = Math.random() > 0.3; // 70%概率获得正积分
  if (isPositive) {
    return Math.floor(Math.random() * 100) + 1;
  } else {
    return -(Math.floor(Math.random() * 50) + 1);
  }
};

// 生成PK记录
const generatePKRecords = (count = 8) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const studentA = randomPick(STUDENT_IDS);
    let studentB = randomPick(STUDENT_IDS);
    // 确保不是同一个学生
    while (studentB === studentA) {
      studentB = randomPick(STUDENT_IDS);
    }

    const isFinished = Math.random() > 0.4; // 60%概率已完成
    const pkId = `pk_${Date.now()}_${i}`;

    const pkRecord = {
      id: pkId,
      studentA,
      studentB,
      topic: generatePKTopic(),
      status: isFinished ? 'finished' : 'pending',
      winnerId: isFinished ? randomPick([studentA, studentB]) : null,
      date: randomRecentDate()
    };

    records.push(pkRecord);
  }
  return records;
};

// 生成挑战记录
const generateChallengeRecords = (count = 6) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const challenge = generateChallenge();
    const isCompleted = Math.random() > 0.5; // 50%概率已完成
    const participantCount = Math.floor(Math.random() * 5) + 2; // 2-6个参与者
    const participants = [];

    // 随机选择参与者
    const availableStudents = [...STUDENT_IDS];
    for (let j = 0; j < Math.min(participantCount, availableStudents.length); j++) {
      const idx = Math.floor(Math.random() * availableStudents.length);
      participants.push(availableStudents.splice(idx, 1)[0]);
    }

    const challengeId = `challenge_${Date.now()}_${i}`;

    records.push({
      id: challengeId,
      title: challenge.title,
      desc: challenge.desc,
      status: isCompleted ? 'completed' : 'active',
      result: isCompleted ? (Math.random() > 0.3 ? 'success' : 'fail') : null,
      participants,
      rewardPoints: challenge.rewardPoints,
      rewardExp: challenge.rewardExp,
      date: randomRecentDate()
    });
  }
  return records;
};

// 生成习惯打卡记录
const generateHabitRecords = (count = 30) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const habit = generateHabitCheckIn();
    const studentCount = Math.floor(Math.random() * 4) + 1; // 1-4个学生
    const students = [];

    const availableStudents = [...STUDENT_IDS];
    for (let j = 0; j < Math.min(studentCount, availableStudents.length); j++) {
      const idx = Math.floor(Math.random() * availableStudents.length);
      students.push(availableStudents.splice(idx, 1)[0]);
    }

    records.push({
      habitId: habit.id,
      studentIds: students,
      date: randomRecentDate()
    });
  }
  return records;
};

// 生成勋章授予记录
const generateBadgeRecords = (count = 15) => {
  const records = [];
  for (let i = 0; i < count; i++) {
    const badge = randomPick(BADGES);
    const studentCount = Math.floor(Math.random() * 3) + 1; // 1-3个学生
    const students = [];

    const availableStudents = [...STUDENT_IDS];
    for (let j = 0; j < Math.min(studentCount, availableStudents.length); j++) {
      const idx = Math.floor(Math.random() * availableStudents.length);
      students.push(availableStudents.splice(idx, 1)[0]);
    }

    records.push({
      badgeId: badge.id,
      studentIds: students,
      date: randomRecentDate()
    });
  }
  return records;
};

// 生成积分和经验更新
const generateScoreUpdates = (count = 20) => {
  const updates = [];
  for (let i = 0; i < count; i++) {
    const studentCount = Math.floor(Math.random() * 5) + 1; // 1-5个学生
    const ids = [];

    const availableStudents = [...STUDENT_IDS];
    for (let j = 0; j < Math.min(studentCount, availableStudents.length); j++) {
      const idx = Math.floor(Math.random() * availableStudents.length);
      ids.push(availableStudents.splice(idx, 1)[0]);
    }

    updates.push({
      ids,
      points: generatePoints(),
      exp: generateExp()
    });
  }
  return updates;
};

// 将PK记录写入数据库（通过events表）
const writePKToDatabase = async (pool, pkRecords) => {
  console.log('    📊 生成PK记录到events表');
  for (let i = 0; i < pkRecords.length; i++) {
    const pk = pkRecords[i];
    await pool.query(
      'INSERT INTO events (type, payload) VALUES (?, ?)',
      ['pk', JSON.stringify({ id: pk.id, winnerId: pk.winnerId })]
    );
  }
  console.log(`    ✅ 成功生成 ${pkRecords.length} 条PK记录`);
};

// 将挑战记录写入数据库
const writeChallengeToDatabase = async (pool, challengeRecords) => {
  console.log('    📊 生成挑战记录到events表');
  for (let i = 0; i < challengeRecords.length; i++) {
    const challenge = challengeRecords[i];
    await pool.query(
      'INSERT INTO events (type, payload) VALUES (?, ?)',
      ['challenge', JSON.stringify({ id: challenge.id, result: challenge.result, participants: challenge.participants })]
    );
  }
  console.log(`    ✅ 成功生成 ${challengeRecords.length} 条挑战记录`);
};

// 将习惯打卡写入数据库
const writeHabitToDatabase = async (pool, habitRecords) => {
  console.log('    📊 生成习惯打卡记录到events表');
  for (let i = 0; i < habitRecords.length; i++) {
    const habit = habitRecords[i];
    await pool.query(
      'INSERT INTO events (type, payload) VALUES (?, ?)',
      ['habit', JSON.stringify({ studentIds: habit.studentIds, habitId: habit.habitId })]
    );
  }
  console.log(`    ✅ 成功生成 ${habitRecords.length} 条习惯打卡记录`);
};

// 将勋章授予写入数据库
const writeBadgeToDatabase = async (pool, badgeRecords) => {
  console.log('    📊 生成勋章授予记录到events表');
  for (let i = 0; i < badgeRecords.length; i++) {
    const badge = badgeRecords[i];
    // 为每个学生生成独立的badge事件
    for (const studentId of badge.studentIds) {
      await pool.query(
        'INSERT INTO events (type, payload) VALUES (?, ?)',
        ['badge', JSON.stringify({ badgeId: badge.badgeId, studentId })]
      );
    }
  }
  console.log(`    ✅ 成功生成 ${badgeRecords.length} 条勋章授予记录（总计授予 ${badgeRecords.reduce((sum, b) => sum + b.studentIds.length, 0)} 次）`);
};

// 将积分和经验更新写入数据库（直接更新students表）
const writeScoreUpdatesToDatabase = async (pool, scoreUpdates) => {
  console.log('    📊 更新学生积分和经验值');
  let totalScoreUpdates = 0;
  for (let i = 0; i < scoreUpdates.length; i++) {
    const update = scoreUpdates[i];
    for (const studentId of update.ids) {
      await pool.query(
        'UPDATE students SET points = points + ?, exp = exp + ? WHERE id = ?',
        [update.points, update.exp, studentId]
      );
      totalScoreUpdates++;
    }
  }
  console.log(`    ✅ 成功更新 ${totalScoreUpdates} 条积分记录`);
};

// 生成并写入所有模拟数据
const generateAllActivity = async (pool) => {
  console.log('\n📊 开始生成模拟数据...\n');

  // 生成PK记录
  console.log('1️⃣ 生成PK挑战数据');
  const pkRecords = generatePKRecords(5);
  await writePKToDatabase(pool, pkRecords);

  // 生成挑战记录
  console.log('\n2️⃣ 生成挑战数据');
  const challengeRecords = generateChallengeRecords(3);
  await writeChallengeToDatabase(pool, challengeRecords);

  // 生成习惯打卡记录
  console.log('\n3️⃣ 生成习惯打卡数据');
  const habitRecords = generateHabitRecords(15);
  await writeHabitToDatabase(pool, habitRecords);

  // 生成勋章授予记录
  console.log('\n4️⃣ 生成勋章授予数据');
  const badgeRecords = generateBadgeRecords(8);
  await writeBadgeToDatabase(pool, badgeRecords);

  // 生成积分和经验更新
  console.log('\n5️⃣ 生成积分和经验数据');
  const scoreUpdates = generateScoreUpdates(10);
  await writeScoreUpdatesToDatabase(pool, scoreUpdates);

  // 为所有学生随机增加等级
  console.log('\n6️⃣ 更新学生等级');
  for (const studentId of STUDENT_IDS) {
    const newLevel = Math.floor(Math.random() * 10) + 5; // 5-15级
    await pool.query('UPDATE students SET level = ? WHERE id = ?', [newLevel, studentId]);
  }
  console.log('    ✅ 成功更新所有学生等级');

  console.log('\n✅ 所有模拟数据生成完成！');
};

// 启动服务器并模拟数据
(async () => {
  try {
    console.log('🚀 启动数据库连接...');
    const pool = await mysql.createPool(process.env.DATABASE_URL || 'mysql://root:hwnhd2l4@growark-mysql.ns-bg6fgs6y.svc:3306/growark');

    // 验证连接
    const [result] = await pool.query('SELECT COUNT(*) as count FROM students');
    const studentCount = result[0].count;
    console.log(`✅ 数据库连接成功！当前有 ${studentCount} 个学生\n`);

    // 生成模拟数据
    await generateAllActivity(pool);

    // 显示生成的数据汇总
    console.log('\n📊 数据生成汇总:');
    const [eventsResult] = await pool.query('SELECT type, COUNT(*) as count FROM events WHERE DATE(created_at) = CURDATE() GROUP BY type');
    eventsResult.forEach(row => {
      console.log(`   ${row.type}: ${row.count} 条记录`);
    });

    await pool.end();
    console.log('\n🎉 模拟数据生成完成！');
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
})();
