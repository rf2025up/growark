import mysql from 'mysql2/promise';

const names = ['庞子玮','刘凡兮','余沁妍','吴逸桐','刘润霖','肖正楠','王彦舒','陈金锐','宋子晨','徐汇洋','黄衍恺','舒昱恺','方景怡','廖研曦','廖一凡','唐艺馨','何泽昕','陈笑妍','彭柏成','樊牧宸','曾欣媛','肖雨虹','宁可歆','廖潇然','肖浩轩','陈梓萌','彭斯晟','谭雨涵'];

(async () => {
  const pool = await mysql.createPool('mysql://root:hwnhd2l4@growark-mysql.ns-bg6fgs6y.svc:3306/growark');
  console.log('=== 将28个真实学生导入数据库 ===\n');
  
  // 删除旧的测试学生（ID 1-20）
  await pool.query('DELETE FROM students WHERE id <= 20');
  console.log('✓ 删除旧的测试学生');
  
  // 插入28个真实学生
  const cls = ['三年一班','三年二班','三年三班'];
  let inserted = 0;
  
  for (let i = 0; i < names.length; i++) {
    const student = {
      id: String(i + 1),
      name: names[i],
      points: Math.floor(Math.random() * 150) + 50,
      exp: Math.floor(Math.random() * 600) + 100,
      level: Math.floor(Math.random() * 15) + 5,
      class_name: cls[i % 3],
      team_id: String(Math.floor(i / 7) + 1)
    };
    
    await pool.query('INSERT INTO students (id, name, points, exp, level, class_name, team_id) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [student.id, student.name, student.points, student.exp, student.level, student.class_name, student.team_id]);
    inserted++;
    console.log(`✓ [${i+1}/28] 插入: ${student.name} (${student.class_name}, 积分:${student.points})`);
  }
  
  // 验证插入
  const [students] = await pool.query('SELECT COUNT(*) as count FROM students');
  console.log(`\n✅ 成功导入 ${students[0].count} 个学生到数据库！`);
  
  // 显示前5个学生
  const [sample] = await pool.query('SELECT id, name, points, exp, level FROM students ORDER BY id LIMIT 5');
  console.log('\n📊 前5个学生示例:');
  sample.forEach(s => {
    console.log(`  ID:${s.id} | ${s.name} | 积分:${s.points} | 经验:${s.exp} | 等级:${s.level}`);
  });
  
  await pool.end();
})();
