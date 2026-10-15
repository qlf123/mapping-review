/* ============================================================
   公共 mock 数据：当前用户、专业树、行业列表
   原型演示用。真实环境由「账号管理」和后端接口提供，此处为前端模拟。
   ============================================================ */

// ===== 当前用户（原型支持切换身份）=====
// role: 'admin' | 'teacher'；teacher 带「可授课程」，teacher_empty 用于演示「暂无可授课程」
var USERS = {
  admin:         { role:'admin',   name:'平台管理员', major:'',            teachableCourses:[] },
  teacher:       { role:'teacher', name:'张明',       major:'导游专业',     teachableCourses:['导游业务','研学旅行管理与服务'] },
  teacher_empty: { role:'teacher', name:'李四',       major:'酒店管理专业', teachableCourses:[] }
};
var CURRENT_USER = USERS.teacher; // 默认「张明（教师）」
function switchUser(key){ if(USERS[key]) CURRENT_USER = USERS[key]; }

// ===== 专业树：专业大类 → 专业 → 课程 =====
var MAJOR_TREE = [
  { name: '旅游类', majors: [
    { name: '导游专业', courses: ['导游业务', '研学旅行管理与服务', '景区讲解', '旅游政策法规'] },
    { name: '酒店管理专业', courses: ['前厅服务与管理', '客房服务与管理', '餐饮服务与管理'] },
    { name: '旅行社经营与管理专业', courses: ['旅行社计调业务', '旅游市场营销'] },
    { name: '研学旅行管理与服务专业', courses: ['研学课程设计', '研学旅行组织'] }
  ]},
  { name: '军事类', majors: [
    { name: '国防教育专业', courses: ['国防教育基础', '军事理论'] }
  ]},
  { name: '电子信息类', majors: [
    { name: '电子信息工程技术专业', courses: ['电路基础', '嵌入式系统开发'] }
  ]},
  { name: '其他', majors: [
    { name: '通用专业', courses: ['职业素养', '信息技术基础'] }
  ]}
];

// ===== 课程列表（mock「课程管理」）：平铺，每门课带「所属专业」 =====
var COURSE_LIST = [];
MAJOR_TREE.forEach(function(cat){
  cat.majors.forEach(function(m){
    m.courses.forEach(function(c){ COURSE_LIST.push({ name:c, major:m.name }); });
  });
});
// 预置「已被关联」的课程（演示唯一性提示）：导游业务 已被《导游业务》知识体系关联
var PRE_LINKED_COURSE = { name:'导游业务', linkedKs:'导游业务' };

// ===== 行业列表（能力图谱）：行业 → 子行业 / 岗位 =====
var INDUSTRY_LIST = [
  { name: '旅游业', subIndustries: ['旅行社', '景区运营', '研学定制', '在线旅游平台', '酒店前厅'], positions: ['研学旅行指导师', '导游', '酒店前台', '旅游计调'] },
  { name: '电商行业', subIndustries: ['网店运营', '直播带货', '供应链服务'], positions: ['电商运营', '直播主播', '客服专员'] },
  { name: '酒店管理', subIndustries: ['前厅', '客房', '餐饮'], positions: ['前厅接待', '客房主管', '餐饮领班'] },
  { name: '物流行业', subIndustries: ['仓储', '运输', '供应链'], positions: ['仓储管理', '运输调度'] }
];

// ===== 通用取数辅助 =====
function allMajors(){
  var list = [];
  MAJOR_TREE.forEach(function(cat){ cat.majors.forEach(function(m){ list.push({ name: m.name, category: cat.name }); }); });
  return list;
}
function categoryOfMajor(majorName){
  var found = null;
  MAJOR_TREE.forEach(function(cat){ cat.majors.forEach(function(m){ if(m.name === majorName) found = cat.name; }); });
  return found;
}
// 教师「所属专业」的上级大类
function teacherCategory(){
  return categoryOfMajor(CURRENT_USER.major);
}
// 可选「专业大类」：不区分角色，老师也可生成专业大类级体系，返回全部大类
function selectableCategories(){
  return MAJOR_TREE.map(function(c){ return c.name; });
}
// 可选「专业」：管理员全部 / 教师仅本人所属专业
function selectableMajors(){
  if(CURRENT_USER.role === 'admin') return allMajors();
  var c = teacherCategory();
  return [{ name: CURRENT_USER.major, category: c }];
}
// 可选「课程」：管理员该专业全部 / 教师仅可授课程
function selectableCourses(majorName){
  var major = null;
  MAJOR_TREE.forEach(function(cat){ cat.majors.forEach(function(m){ if(m.name === majorName) major = m; }); });
  if(!major) return [];
  if(CURRENT_USER.role === 'admin') return major.courses;
  return major.courses.filter(function(c){ return CURRENT_USER.teachableCourses.indexOf(c) >= 0; });
}
// 知识体系「范围」默认值：教师=课程，管理员=专业
function defaultKsRange(){ return '专业大类'; }
// 能力图谱「范围」默认值：教师=岗位，管理员=行业
function defaultAgScope(){ return CURRENT_USER.role === 'teacher' ? '岗位' : '行业'; }

// ===== 关联对象取数（知识体系「关联对象」下拉用）=====
function allCategories(){ return selectableCategories(); }
function allCourses(){ return COURSE_LIST; }
// 可选「关联课程」：管理员全部 / 教师仅可授课程（带所属专业）
function selectableRelCourses(){
  if(CURRENT_USER.role === 'admin') return COURSE_LIST;
  return COURSE_LIST.filter(function(c){ return CURRENT_USER.teachableCourses.indexOf(c.name) >= 0; });
}
// 课程所属专业
function majorOfCourse(courseName){
  var c = COURSE_LIST.find(function(x){ return x.name === courseName; });
  return c ? c.major : '';
}

/* ============================================================
   AI 构建（当前为前端 mock，接入真实 AI 时替换此处）
   知识体系调用入口：knowledge-system.html 的 submitCreateKs()
   能力图谱调用入口：ability-graph.js 的 showBuildingAnimation()
   真实接入：把下面 mock 函数替换为后端 / Dify 工作流调用。
   入参：范围 + 对象名 + 父链；出参：{ tree, nodeCount }。
   ============================================================ */

// 知识体系：按「范围」生成以所选对象为根的树
function mockKsTree(range, objectName, path){
  if(range === '课程'){
    return { name: objectName, type: 'course', path: path, children: [
      { name: objectName + '·任务1', type: 'task', children: [
        { name: '操作流程：' + objectName + '服务', type: 'process' },
        { name: '技能：' + objectName + '执行', type: 'skill', children: [
          { name: '知识点：' + objectName + '基础', type: 'knowledge' },
          { name: '达标依据：' + objectName + '规范', type: 'criterion' }
        ]}
      ]},
      { name: objectName + '·任务2', type: 'task', children: [
        { name: '案例：' + objectName + '实操', type: 'case' }
      ]}
    ]};
  }
  if(range === '专业'){
    return { name: objectName, type: 'major', path: path, children: [
      { name: '专业核心课程', type: 'category', children: [
        { name: objectName + '核心课1', type: 'course', children: [
          { name: '任务：课程基础', type: 'task', children: [ { name: '知识点', type: 'knowledge' } ] }
        ]}
      ]}
    ]};
  }
  return { name: objectName, type: 'major_category', path: path, children: [
    { name: objectName + '专业A', type: 'major' },
    { name: objectName + '专业B', type: 'major' }
  ]};
}
function countTreeNodes(node){
  if(!node) return 0;
  var n = 1;
  (node.children || []).forEach(function(c){ n += countTreeNodes(c); });
  return n;
}
