const $ = s => document.querySelector(s);
const uid = () => 'id-' + Math.random().toString(36).slice(2, 9);

// 勾选能力项时自动选中等级 L2
function autoSelectL2(cb){
  if(cb.checked){
    const row = cb.closest('.ability-select-row');
    if(row){
      const checked = row.querySelector('.abi-level:checked');
      if(!checked){
        const l2 = row.querySelector('.abi-level[value="L2"]');
        if(l2) l2.checked = true;
      }
    }
  }
}

function addLevel(blockId, btnId){
  const b = document.getElementById(blockId);
  const btn = document.getElementById(btnId);
  if(b) b.style.display = '';
  if(btn) btn.style.display = 'none';
}
function removeLevel(blockId, btnId){
  const b = document.getElementById(blockId);
  const btn = document.getElementById(btnId);
  if(b) b.style.display = 'none';
  if(btn) btn.style.display = '';
}

// 能力图谱列表数据
let graphs = [
  {
    id: 'g1',
    name: '旅游业',
    describe: '本图谱以旅游活动组织、目的地接待与游览服务为核心，按岗位能力体系相似性划定边界。纳入旅行社组团与地接、景区运营、研学定制、在线旅游平台及酒店前厅等直接面向游客的接待服务岗位。',
    status: 'built',
    createdAt: '2026-09-09',
    stats: { positions: 10, abilities: 28, subIndustries: 5 },
    tree: {
      id: 'n1', name: '旅游业', aliases: ['旅游产业','文旅产业'], describe: '以旅游活动组织、目的地接待与游览服务为核心',
      info: { stats: { positions:10, distinctAbilities:28, subIndustries:5 } },
      subIndustries: [
        {
          id: 'n2', name: '旅行社与组团地接服务', describe: '从事旅游线路设计、团队组织、地接安排与导游带团服务',
          info: { priority: 'core', typicalEmployers: ['传统旅行社','地接社','出境游批发商'] },
          positions: [
            {
              id: 'n3', name: '导游', aliases: ['地陪','全陪'], describe: '带领游客按行程游览，负责讲解、照料及突发事件处理', careerLevel: '初级/中级',
              abilities: [
                { id:'n5', name:'旅游产品与目的地知识储备', type:'knowledge', domain:'产品策划与行程设计', core:true, weight:0.25, requiredLevel:'L2', behaviorDesc:'独立向客户完整讲述目的地的历史沿革、文化特色与游览亮点', observablePoints:['按时间线叙述历史沿革','将文化特色与具体建筑或风俗对应','结合季节说明最佳游览方式','回答游客即兴追问'], assessMethod:'模拟讲解考核', inferred:false, flag:null },
                { id:'n6', name:'行程动线规划与设计', type:'skill', domain:'产品策划与行程设计', core:false, weight:0.3, requiredLevel:'L3', behaviorDesc:'设计包含沉浸式演艺、非遗手作等新业态的非标线路', observablePoints:['产出图文并茂的路书文档','将声光电互动节点嵌入行程时间轴','根据天气预案生成AB两套路线'], assessMethod:'客户验收与转化率追踪', inferred:false, flag:null },
                { id:'n7', name:'AI行程规划工具应用', type:'skill', domain:'数字化系统与信息处理', core:false, weight:0.2, requiredLevel:'L2', behaviorDesc:'使用AI工具生成行程初稿并30分钟内完成人工校验', observablePoints:['调整AI生成的景点顺序','补充AI遗漏的特殊需求','核查AI输出的门票价格时效性'], assessMethod:'限时实操考核', inferred:true, flag:'新兴能力：仅有市场来源' },
                { id:'n8', name:'景点讲解与文化传播表达', type:'skill', domain:'讲解服务与文化传播', core:true, weight:0.35, requiredLevel:'L2', behaviorDesc:'根据游客年龄与兴趣点灵活运用故事化手法即兴调整讲解内容', observablePoints:['针对亲子团增加趣味互动','针对老年团放慢语速','用类比法解释生僻概念'], assessMethod:'神秘客暗访或录音抽检', inferred:false, flag:null }
              ]
            },
            {
              id:'n4', name:'旅行社计调', aliases:['OP','计调员'], describe:'负责旅游线路产品的策划、报价、采购与行程安排', careerLevel:'中级/高级',
              abilities: [
                { id:'n9', name:'旅游产品线路设计与成本核算', type:'skill', domain:'产品策划与行程设计', core:true, weight:0.3, requiredLevel:'L3', behaviorDesc:'独立完成线路设计、成本核算与报价方案', observablePoints:['产出含成本明细的报价单','比较至少三家地接资源价格','根据客户预算调整行程要素'], assessMethod:'方案评审', inferred:false, flag:null },
                { id:'n10', name:'计调操作系统与订单处理', type:'skill', domain:'数字化系统与信息处理', core:false, weight:0.2, requiredLevel:'L2', behaviorDesc:'熟练使用旅行社管理系统完成订单录入、改单与退单', observablePoints:['15分钟内完成标准订单录入','正确处理退改签规则','生成结算清单'], assessMethod:'系统操作考核', inferred:false, flag:null }
              ]
            }
          ]
        },
        {
          id:'n11', name:'旅游景区与主题公园运营管理', describe: '从事景区票务、游客服务、讲解与活动运营管理',
          info: { priority:'core', typicalEmployers:['旅游景区','主题公园','博物馆'] },
          positions: [
            {
              id:'n12', name:'景区讲解员', aliases:['景区导游'], describe:'在景区内为游客提供专业讲解与导览服务', careerLevel:'初级/中级',
              abilities: [
                { id:'n13', name:'旅游资源归类与讲解', type:'knowledge', domain:'讲解服务与文化传播', core:true, weight:0.3, requiredLevel:'L2', behaviorDesc:'按国标分类体系准确识别并讲解自然与人文旅游资源', observablePoints:['现场辨识建筑形制','准确使用专业术语','回答游客延伸提问'], assessMethod:'现场讲解考核', inferred:false, flag:null },
                { id:'n14', name:'分众化讲解适配', type:'skill', domain:'讲解服务与文化传播', core:true, weight:0.25, requiredLevel:'L2', behaviorDesc:'根据游客群体特征调整讲解内容深度与表达方式', observablePoints:['为研学团增加互动设计','为银发团调整语速','为亲子团增加趣味问答'], assessMethod:'多客群模拟讲解', inferred:false, flag:null }
              ]
            }
          ]
        },
        {
          id:'n15', name:'研学旅行与定制旅游策划执行', describe:'从事研学课程开发、定制旅游方案设计与执行',
          info:{priority:'emerging',typicalEmployers:['研学机构','定制旅行公司']},
          positions:[
            {
              id:'n16', name:'研学旅行指导师', aliases:['研学导师'], describe:'策划并实施研学旅行课程，引导学生在旅行中学习', careerLevel:'中级',
              abilities:[
                { id:'n17', name:'研学课程设计与实施', type:'skill', domain:'产品策划与行程设计', core:true, weight:0.35, requiredLevel:'L3', behaviorDesc:'围绕教育目标设计研学课程方案并组织现场实施', observablePoints:['产出含教学目标的课程方案','设计研学任务单与评价表','现场引导学生完成探究活动'], assessMethod:'课程方案评审+现场观察', inferred:false, flag:null },
                { id:'n18', name:'安全风险识别与隐患排查', type:'skill', domain:'安全管理与应急处置', core:true, weight:0.2, requiredLevel:'L2', behaviorDesc:'在研学场景中识别安全风险并启动隐患排查流程', observablePoints:['行前完成场地安全踏勘','识别交通与餐饮风险点','启动应急预案'], assessMethod:'安全踏勘报告评审', inferred:false, flag:null }
              ]
            }
          ]
        }
      ]
    }
  },
  { id:'g2', name:'电商行业', describe:'以电子商务平台运营、网店管理、直播带货与供应链服务为核心能力体系。', status:'built', createdAt:'2026-09-08', stats:{positions:8,abilities:22,subIndustries:4}, tree:{id:'n20',name:'电商行业',aliases:['电子商务'],describe:'以电子商务平台运营为核心',info:{stats:{positions:8,distinctAbilities:22,subIndustries:4}},subIndustries:[]} },
  { id:'g3', name:'酒店管理', describe:'以前厅接待、宾客关系与管家服务为核心，不覆盖客房工程与后厨岗位。', status:'building', createdAt:'2026-09-10', stats:{positions:0,abilities:0,subIndustries:0}, tree:null },
  { id:'g4', name:'物流行业', describe:'以仓储管理、运输调度与供应链协同为核心能力体系。', status:'failed', createdAt:'2026-09-12', stats:{positions:0,abilities:0,subIndustries:0}, tree:null }
];

// 当前状态
let currentGraphId = null;
let expandedNodes = new Set();

// sessionStorage 数据同步
function saveGraphs(){
  try { sessionStorage.setItem('ability_graphs', JSON.stringify(graphs)); } catch(e) {}
}
function loadGraphs(){
  try {
    const stored = sessionStorage.getItem('ability_graphs');
    if(stored){ graphs = JSON.parse(stored); return true; }
  } catch(e) {}
  return false;
}

// 层级配置
const LEVELS = [
  { key:'subIndustries', label:'子行业', icon:'行', cls:'level-subindustry', childKey:'positions' },
  { key:'positions', label:'岗位', icon:'岗', cls:'level-position', childKey:'abilities' },
  { key:'abilities', label:'能力项', icon:'能', cls:'level-ability', childKey:null }
];

function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}

// ========== 列表渲染 ==========
function renderList(){
  if(!$('#graphList')) return;
  const html = graphs.map(g=>{
    const isBuilding = g.status==='building';
    const isFailed = g.status==='failed';
    const isConfirmed = g.status==='confirmed' || g.confirmed;
    const isBuilt = g.status==='built' && !isConfirmed;
    // 状态文案与徽标
    let statusBadge, stats;
    if(isBuilding){
      statusBadge = '<span class="graph-card-status building">构建中</span>';
      stats = `<div><span>状态</span><strong>AI 正在构建…</strong></div>`;
    } else if(isFailed){
      statusBadge = '<span class="graph-card-status failed">构建失败</span>';
      stats = `<div><span>状态</span><strong style="color:#c72c2a">构建失败，请重试</strong></div>`;
    } else if(isConfirmed){
      statusBadge = '<span class="graph-card-status confirmed">已确认</span>';
      stats = `
        <div><span>子行业</span><strong>${g.stats.subIndustries}</strong></div>
        <div><span>岗位</span><strong>${g.stats.positions}</strong></div>
        <div><span>能力项</span><strong>${g.stats.abilities}</strong></div>`;
    } else {
      statusBadge = '<span class="graph-card-status built">构建完成</span>';
      stats = `
        <div><span>子行业</span><strong>${g.stats.subIndustries}</strong></div>
        <div><span>岗位</span><strong>${g.stats.positions}</strong></div>
        <div><span>能力项</span><strong>${g.stats.abilities}</strong></div>`;
    }
    // 右上角操作按钮
    const cardActions = `<div class="graph-card-corner" onclick="event.stopPropagation()">
      <button class="corner-btn" onclick="editGraph('${g.id}')">编辑</button>

      <button class="corner-btn danger" onclick="deleteGraph('${g.id}')">删除</button>
    </div>`;
    // 底部按钮：构建中不显示，构建失败显示"重新构建"，其他显示"进入图谱"
    let bottomBtn = '';
    if(isFailed){
      bottomBtn = `<div class="graph-card-actions" onclick="event.stopPropagation()"><button onclick="rebuildGraph('${g.id}')" class="rebuild-btn">重新构建</button></div>`;
    } else if(!isBuilding){
      bottomBtn = `<div class="graph-card-actions" onclick="event.stopPropagation()"><button onclick="enterTree('${g.id}')" class="enter-btn">进入图谱</button></div>`;
    }
    const cardClick = (isBuilding || isFailed) ? '' : ` onclick="enterTree('${g.id}')"`;
    return `<div class="graph-card" data-graph="${g.id}"${cardClick}>
      ${cardActions}
      <div class="graph-card-name">${g.name}</div>
      ${statusBadge}
      <div class="graph-card-desc">${g.describe||''}</div>
      <div class="graph-card-stats">${stats}</div>
      ${bottomBtn}
    </div>`;
  }).join('');
  $('#graphList').innerHTML = html || '<div class="empty-state">暂无能力图谱，点击右上角新增</div>';
}

// 确认能力图谱（在详情页操作）
function confirmGraph(graphId){
  const g = graphs.find(x=>x.id===graphId);
  if(!g) return;
  if(!g.tree || !g.tree.subIndustries || g.tree.subIndustries.length===0){
    return toast('图谱尚未构建任何节点，无法确认');
  }
  g.status = 'confirmed';
  g.confirmed = true;
  toast('能力图谱已确认');
  // 刷新详情页状态徽标和按钮
  const badge = $('#treeStatusBadge');
  if(badge){ badge.textContent = '已确认'; badge.className = 'tree-status-badge confirmed'; }
  const confirmBtn = $('#confirmGraphBtn');
  if(confirmBtn) confirmBtn.style.display = 'none';
  // 同步更新列表数据
  saveGraphs();
  renderList();
}

// 编辑图谱基本信息（名称、描述）
let editingGraphId = null;
function editGraph(graphId){
  editingGraphId = graphId;
  const g = graphs.find(x=>x.id===graphId);
  if(!g) return;
  $('#editGraphName').value = g.name || '';
  $('#editGraphDesc').value = g.describe || '';
  openModal('#editGraphModal');
}

let currentSettingsGraphId = null;
function roleLabel(r){ return {admin:'管理员',expert:'专家',editor:'编辑者',viewer:'查看者'}[r] || r; }
function openGraphSettings(graphId){
  currentSettingsGraphId = graphId;
  const g = graphs.find(x=>x.id===graphId);
  if(!g) return;
  // 显示当前状态
  const statusText = g.status==='building'?'构建中':(g.status==='confirmed'||g.confirmed?'已确认':'构建完成');
  let settingsHtml = `<label>图谱名称<input type="text" value="${esc(g.name)}" disabled /></label>`;
  settingsHtml += `<label>当前状态<span class="settings-status">${statusText}</span></label>`;
  settingsHtml += `<label>创建时间<span class="settings-status">${g.createdAt||'-'}</span></label>`;
  settingsHtml += `<label>统计<span class="settings-status">子行业 ${g.stats.subIndustries} · 岗位 ${g.stats.positions} · 能力项 ${g.stats.abilities}</span></label>`;
  // 状态切换
  if(g.status === 'confirmed' || g.confirmed){
    settingsHtml += `<label>撤回确认<div class="settings-tip">撤回后图谱回到"构建完成"状态，可继续编辑节点</div><button class="task-button" id="revokeConfirmBtn" type="button" style="width:100%">撤回确认状态</button></label>`;
  } else if(g.status === 'built'){
    settingsHtml += `<label>确认图谱<div class="settings-tip">确认后图谱不可再编辑节点，进入只读状态</div><button class="task-button" id="quickConfirmBtn" type="button" style="width:100%;background:#5149e9;color:#fff;border-color:#5149e9;">确认图谱</button></label>`;
  }
  // 权限设置
  const perm = g.permissions || { view:['admin'], edit:['admin'], confirm:['admin'] };
  const roleOptions = ['admin','expert','editor','viewer'];
  settingsHtml += `<label>权限管理<div class="settings-tip">控制哪些角色可查看、编辑、确认该图谱</div>
    <div class="perm-group"><span class="perm-label">查看权限</span>
    <div class="checkbox-group compact">
    ${roleOptions.map(r=>`<label><input type="checkbox" class="perm-view" value="${r}" ${perm.view.includes(r)?'checked':''}> ${roleLabel(r)}</label>`).join('')}
    </div></div>
    <div class="perm-group"><span class="perm-label">编辑权限</span>
    <div class="checkbox-group compact">
    ${roleOptions.map(r=>`<label><input type="checkbox" class="perm-edit" value="${r}" ${perm.edit.includes(r)?'checked':''}> ${roleLabel(r)}</label>`).join('')}
    </div></div>
    <div class="perm-group"><span class="perm-label">确认权限</span>
    <div class="checkbox-group compact">
    ${roleOptions.map(r=>`<label><input type="checkbox" class="perm-confirm" value="${r}" ${perm.confirm.includes(r)?'checked':''}> ${roleLabel(r)}</label>`).join('')}
    </div></div>
  </label>`;
  settingsHtml += `<label>描述<textarea id="settingsDesc" rows="3">${esc(g.describe||'')}</textarea></label>`;
  $('#settingsForm').innerHTML = settingsHtml;
  // 绑定按钮
  $('#quickConfirmBtn')?.addEventListener('click', ()=>{
    if(!g.tree || !g.tree.subIndustries || g.tree.subIndustries.length===0){ toast('图谱尚未构建任何节点，无法确认'); return; }
    g.status = 'confirmed'; g.confirmed = true;
    saveGraphs(); renderList(); closeModal('#graphSettingsModal'); toast('已确认图谱');
  });
  $('#revokeConfirmBtn')?.addEventListener('click', ()=>{
    g.status = 'built'; g.confirmed = false;
    saveGraphs(); renderList(); closeModal('#graphSettingsModal'); toast('已撤回确认');
  });
  openModal('#graphSettingsModal');
}

// ========== 进入详情页（跳转到独立页面）==========
function enterTree(graphId){
  const g = graphs.find(x=>x.id===graphId);
  if(!g || !g.tree) { toast('图谱尚未构建完成'); return; }
  saveGraphs();
  location.href = 'ability-graph-tree.html?id=' + graphId;
}

// ========== 详情页初始化 ==========
function initTreePage(){
  loadGraphs();
  const gid = new URLSearchParams(location.search).get('id');
  if(!gid){ location.href = 'ability-graph.html'; return; }
  const g = graphs.find(x=>x.id===gid);
  if(!g || !g.tree){ location.href = 'ability-graph.html'; return; }
  currentGraphId = gid;
  $('#treeTitle').textContent = g.name + ' · 能力图谱';
  // 渲染状态徽标
  const badge = $('#treeStatusBadge');
  const isConfirmed = g.status === 'confirmed' || g.confirmed;
  if(g.status === 'building'){
    badge.textContent = '构建中';
    badge.className = 'tree-status-badge building';
  } else if(isConfirmed){
    badge.textContent = '已确认';
    badge.className = 'tree-status-badge confirmed';
  } else {
    badge.textContent = '构建完成';
    badge.className = 'tree-status-badge built';
  }
  const confirmBtn = $('#confirmGraphBtn');
  confirmBtn.style.display = (g.status === 'built' && !isConfirmed) ? '' : 'none';
  renderTreeStats(g.tree);
  renderGraph(g.tree);
}

function renderTreeStats(tree){
  const si = tree.subIndustries?.length || 0;
  let posCount=0, ablCount=0, coreCount=0;
  const ablSet = new Set();
  (tree.subIndustries||[]).forEach(sub=>{
    posCount += sub.positions?.length||0;
    (sub.positions||[]).forEach(p=>{
      (p.abilities||[]).forEach(a=>{
        ablCount++;
        if(a.core) coreCount++;
        ablSet.add(a.id);
      });
    });
  });
  $('#treeStats').innerHTML = `
    <div><span>子行业</span><strong>${si}</strong></div>
    <div><span>岗位</span><strong>${posCount}</strong></div>
    <div><span>能力项</span><strong>${ablSet.size}</strong></div>
    <div><span>核心能力</span><strong>${coreCount}</strong></div>`;
}

// SVG 横向四列布局
function renderGraph(tree){
  const subs = tree.subIndustries || [];
  // 扁平化岗位
  const positions = [];
  subs.forEach(s => {
    (s.positions||[]).forEach(p => {
      positions.push({ ...p, subId: s.id, subName: s.name });
    });
  });
  // 扁平化能力项（去重 + 记录被哪些岗位要求）
  const ablMap = new Map();
  positions.forEach(p => {
    (p.abilities||[]).forEach(a => {
      if(!ablMap.has(a.id)){
        ablMap.set(a.id, { ...a, requiredBy: [], parentPosId: p.id });
      }
      ablMap.get(a.id).requiredBy.push({ position: p.id, posName: p.name, level: a.requiredLevel });
    });
  });
  const abilities = [...ablMap.values()];

  // 布局参数
  const ROWH = 24, TOP = 18;
  const XI=[8,100], XS=[150,310], XP=[360,510], XA=[600,860];
  const GW = 868;
  const GH = TOP*2 + Math.max(abilities.length, positions.length, 1)*ROWH + 10;

  // 岗位 Y 坐标：按子行业分组排列
  const posLayout = [];
  let y = TOP + 12;
  const gaps = subs.length - 1;
  const totalSlots = positions.length + gaps * 0.7;
  const step = totalSlots > 1 ? (GH - TOP*2 - 24) / (totalSlots - 1) : 0;
  let prevSub = null;
  subs.forEach(s => {
    if(prevSub !== null) y += step * 0.7;
    (s.positions||[]).forEach(p => {
      posLayout.push({ id: p.id, y, subId: s.id });
      y += step;
    });
    prevSub = s.id;
  });
  const posY = {};
  posLayout.forEach(p => { posY[p.id] = p.y; });

  // 能力项 Y 坐标：按要求它的岗位的平均 y 排序
  const ablOrder = abilities.slice().sort((a, b) => {
    const myA = a.requiredBy.length ? a.requiredBy.reduce((s, r) => s + (posY[r.position]||0), 0) / a.requiredBy.length : 0;
    const myB = b.requiredBy.length ? b.requiredBy.reduce((s, r) => s + (posY[r.position]||0), 0) / b.requiredBy.length : 0;
    return myA - myB;
  });
  const ablY = {};
  ablOrder.forEach((a, i) => { ablY[a.id] = TOP + 12 + i * ROWH; });

  // 子行业 Y 坐标
  const subY = {};
  subs.forEach(s => {
    const ys = (s.positions||[]).map(p => posY[p.id]).filter(v => v !== undefined);
    subY[s.id] = ys.length ? (Math.min(...ys) + Math.max(...ys)) / 2 : GH / 2;
  });
  const indY = GH / 2;

  // 贝塞尔曲线连接函数
  function link(x1, y1, x2, y2){
    const dx = (x2 - x1) * 0.5;
    return `M ${x1} ${y1.toFixed(1)} C ${x1+dx} ${y1.toFixed(1)}, ${x2-dx} ${y2.toFixed(1)}, ${x2} ${y2.toFixed(1)}`;
  }

  // 构建连线
  let links = '';
  // 行业 → 子行业
  subs.forEach(s => {
    links += `<path class="glink base" d="${link(XI[1], indY, XS[0], subY[s.id])}"></path>`;
  });
  // 子行业 → 岗位
  posLayout.forEach(p => {
    links += `<path class="glink base" d="${link(XS[1], subY[p.subId], XP[0], p.y)}"></path>`;
  });
  // 岗位 → 能力项（多对多交叉连线）
  positions.forEach(p => {
    (p.abilities||[]).forEach(a => {
      const lv = (a.requiredLevel || 'L2').replace('L','');
      links += `<path class="glink lv${lv}" d="${link(XP[1], posY[p.id], XA[0]-6, ablY[a.id])}"></path>`;
    });
  });

  // 构建节点
  let nodes = '';
  // 行业节点
  nodes += `<g class="gnode" data-nid="${esc(tree.id)}" data-level="0">
    <rect x="${XI[0]}" y="${indY-18}" width="${XI[1]-XI[0]}" height="36" rx="9" fill="#edeaff" stroke="#5149e9"/>
    <text x="${(XI[0]+XI[1])/2}" y="${indY}" text-anchor="middle" dominant-baseline="central" class="gt gt-ind">${esc(tree.name)}</text></g>`;

  // 子行业节点
  subs.forEach(s => {
    const w = XS[1]-XS[0];
    nodes += `<g class="gnode" data-nid="${esc(s.id)}" data-level="1">
      <rect x="${XS[0]}" y="${subY[s.id]-15}" width="${w}" height="30" rx="8" fill="#f0f4ff" stroke="#d0d8e8"/>
      <text x="${XS[0]+11}" y="${subY[s.id]}" dominant-baseline="central" class="gt">${esc(fitText(s.name, w-38))}</text>
      <text x="${XS[1]-10}" y="${subY[s.id]}" text-anchor="end" dominant-baseline="central" class="gt gt-n">${(s.positions||[]).length}</text></g>`;
  });

  // 岗位节点
  posLayout.forEach(p => {
    const w = XP[1]-XP[0];
    const P = positions.find(x=>x.id===p.id);
    nodes += `<g class="gnode" data-nid="${esc(p.id)}" data-level="2">
      <rect x="${XP[0]}" y="${p.y-14}" width="${w}" height="28" rx="8" fill="#fff8ef" stroke="#e8d8c0"/>
      <text x="${XP[0]+11}" y="${p.y}" dominant-baseline="central" class="gt">${esc(fitText(P.name, w-38))}</text>
      <text x="${XP[1]-10}" y="${p.y}" text-anchor="end" dominant-baseline="central" class="gt gt-n">${(P.abilities||[]).length}</text></g>`;
  });

  // 能力项节点
  abilities.forEach(a => {
    const y = ablY[a.id];
    nodes += `<g class="gnode ab" data-nid="${esc(a.id)}" data-level="3">
      <rect x="${XA[0]-4}" y="${y-11}" width="${XA[1]-XA[0]+4}" height="22" rx="6" class="abbg"/>
      <text x="${XA[0]+14}" y="${y}" dominant-baseline="central" class="gt gt-ab">${esc(fitText(a.name, 180))}${a.core ? ' ★' : ''}</text>
      <text x="${XA[1]-4}" y="${y}" text-anchor="end" dominant-baseline="central" class="gt gt-n">×${a.requiredBy.length}</text></g>`;
  });

  // 操作按钮覆盖层已移除，改用右键菜单和左键选中
  let actionOverlay = '';

  const colHeaders = `<text x="${XI[0]}" y="8" class="gch">行业</text>
    <text x="${XS[0]}" y="8" class="gch">子行业 ${subs.length}</text>
    <text x="${XP[0]}" y="8" class="gch">岗位 ${positions.length}</text>
    <text x="${XA[0]}" y="8" class="gch">能力项 ${abilities.length}</text>`;

  $('#treeContainer').innerHTML = `<div class="tree-svg-wrap">
    <svg viewBox="0 0 ${GW} ${GH}" preserveAspectRatio="xMidYMin meet" role="img" aria-label="四层能力树形图">
      <g class="colhead">${colHeaders}</g>
      ${links}${nodes}
    </svg>
  </div>`;
  bindNodeEvents();
}

// 当前选中节点
let selectedNodeId = null;

function selectNode(nodeId){
  selectedNodeId = nodeId;
  document.querySelectorAll('.gnode').forEach(g => {
    g.classList.toggle('sel', g.dataset.nid === nodeId);
  });
}

function hideContextMenu(){
  const m = $('#contextMenu');
  if(m){ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); }
}

function showContextMenu(nodeId, level, x, y){
  const m = $('#contextMenu');
  if(!m) return;
  const labels = ['行业','子行业','岗位','能力项'];
  let items = '';
  // 添加子节点（仅 0/1/2 层级）
  if(level < 3){
    items += `<div class="context-menu-item" data-cmd="add" data-nid="${nodeId}" data-level="${level}"><span class="cm-icon">＋</span>添加${level===0?'子行业':level===1?'岗位':'能力项'}</div>`;
    items += `<div class="context-menu-separator"></div>`;
  }
  // 添加同级节点（level > 0）
  if(level > 0){
    items += `<div class="context-menu-item" data-cmd="addSibling" data-nid="${nodeId}" data-level="${level}"><span class="cm-icon">＋</span>添加同级${labels[level]}</div>`;
  }
  // 编辑（所有层级）
  items += `<div class="context-menu-item" data-cmd="edit" data-nid="${nodeId}" data-level="${level}"><span class="cm-icon">✎</span>编辑${labels[level]}</div>`;
  // 删除（仅 1/2/3 层级，根节点不可删）
  if(level > 0){
    items += `<div class="context-menu-item danger" data-cmd="delete" data-nid="${nodeId}" data-level="${level}"><span class="cm-icon">✕</span>删除${labels[level]}</div>`;
  }
  m.innerHTML = items;
  // 边界处理
  const w = 180, h = items.split('context-menu-item').length * 32 + 10;
  const maxX = window.innerWidth - w - 4;
  const maxY = window.innerHeight - h - 4;
  m.style.left = Math.min(x, maxX) + 'px';
  m.style.top = Math.min(y, maxY) + 'px';
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
  // 绑定菜单项点击
  m.querySelectorAll('.context-menu-item').forEach(it => {
    it.onclick = (e) => {
      e.stopPropagation();
      const cmd = it.dataset.cmd;
      const nid = it.dataset.nid;
      const lv = parseInt(it.dataset.level);
      hideContextMenu();
      if(cmd === 'add') openAddChild(nid, lv);
      else if(cmd === 'addSibling') addSibling(nid, lv);
      else if(cmd === 'edit') editNode(nid, lv);
      else if(cmd === 'delete') deleteNode(nid, lv);
    };
  });
}

// 添加同级节点：找到父节点，在父节点下添加同类型子节点
function addSibling(nodeId, level){
  const parentResult = findParent(nodeId, level);
  if(!parentResult || !parentResult.parent){ toast('无法添加同级节点'); return; }
  const parentLevel = parentResult.level - 1;
  openAddChild(parentResult.parent.id, parentLevel);
}

// 节点事件：选中 + 右键菜单
function bindNodeEvents(){
  const svg = document.querySelector('.tree-svg-wrap svg');
  if(!svg) return;
  // 左键点击：选中节点
  svg.addEventListener('click', e => {
    const g = e.target.closest('g.gnode');
    if(!g){ return; }
    const nid = g.dataset.nid;
    selectNode(nid);
  });
  // 右键：弹出操作菜单
  svg.addEventListener('contextmenu', e => {
    const g = e.target.closest('g.gnode');
    if(!g) return;
    e.preventDefault();
    const nid = g.dataset.nid;
    const lv = parseInt(g.dataset.level);
    selectNode(nid);
    showContextMenu(nid, lv, e.clientX, e.clientY);
  });
  // 复用原 hover 联动
  bindNodeHover();
}

// SVG 节点 hover 联动（操作按钮已移除，仅保留函数避免报错）
function bindNodeHover(){}

// 文本截断
function fitText(s, maxPx, fontSize){
  if(!s) return '';
  if(!fontSize) fontSize = 11.5;
  const charW = fontSize * 0.95;
  const max = Math.floor(maxPx / charW);
  return s.length > max ? s.slice(0, max-1) + '…' : s;
}

// 以下函数保留供 CRUD 使用
function getNodeChildren(node, level){
  if(level === 0) return node.subIndustries;
  if(level === 1) return node.positions;
  if(level === 2) return node.abilities;
  return null;
}

function setNodeChildren(node, level, children){
  if(level === 0) node.subIndustries = children;
  else if(level === 1) node.positions = children;
  else if(level === 2) node.abilities = children;
}

// ========== 查找节点 ==========
function findNode(nodeId, level){
  const g = graphs.find(x=>x.id===currentGraphId);
  if(!g || !g.tree) return null;
  return _findInTree(g.tree, nodeId, 0);
}

function _findInTree(node, nodeId, level){
  if(node.id === nodeId) return { node, level };
  const children = getNodeChildren(node, level);
  if(children){
    for(const c of children){
      const found = _findInTree(c, nodeId, level+1);
      if(found) return found;
    }
  }
  return null;
}

function findParent(nodeId, level){
  const g = graphs.find(x=>x.id===currentGraphId);
  if(!g || !g.tree) return null;
  if(level === 0) return { parent: null, level: -1 };
  return _findParentInTree(g.tree, nodeId, 0, null);
}

function _findParentInTree(node, nodeId, level, parent){
  if(node.id === nodeId) return { parent, level };
  const children = getNodeChildren(node, level);
  if(children){
    for(const c of children){
      const found = _findParentInTree(c, nodeId, level+1, node);
      if(found) return found;
    }
  }
  return null;
}

// ========== 删除图谱 ==========
function deleteGraph(graphId){
  if(!confirm('确认删除该能力图谱？此操作不可撤销。')) return;
  graphs = graphs.filter(g=>g.id!==graphId);
  toast('已删除能力图谱');
  saveGraphs();
  renderList();
}

// ========== 删除节点 ==========
function deleteNode(nodeId, level){
  if(!confirm('确认删除该节点及其所有子节点？')) return;
  const result = findParent(nodeId, level);
  if(!result || !result.parent) { toast('无法删除根节点'); return; }
  const children = getNodeChildren(result.parent, result.level-1);
  const idx = children.findIndex(c=>c.id===nodeId);
  if(idx>-1){
    children.splice(idx,1);
    setNodeChildren(result.parent, result.level-1, children);
    toast('已删除节点');
    const g = graphs.find(x=>x.id===currentGraphId);
    renderTree(g.tree);
    renderTreeStats(g.tree);
    saveGraphs();
  }
}

// ========== 编辑节点弹窗 ==========
let editingNodeId = null, editingNodeLevel = -1;

function editNode(nodeId, level){
  editingNodeId = nodeId;
  editingNodeLevel = level;
  const result = findNode(nodeId, level);
  if(!result) return;
  const node = result.node;
  const g = getGraph();
  const tree = g?.tree;
  const titles = ['编辑行业','编辑子行业','编辑岗位','编辑能力项'];
  $('#editNodeTitle').textContent = titles[level] || '编辑节点';
  let fields = `<label>名称<input id="editName" type="text" value="${esc(node.name||'')}" /></label>`;
  if(level <= 2 && node.describe !== undefined) fields += `<label>描述<textarea id="editDesc" rows="3">${esc(node.describe||'')}</textarea></label>`;
  if(level === 3){
    fields += `<label>类型<select id="editType"><option value="knowledge" ${node.type==='knowledge'?'selected':''}>知识</option><option value="skill" ${node.type==='skill'?'selected':''}>技能</option><option value="attitude" ${node.type==='attitude'?'selected':''}>素养</option></select></label>`;
    fields += `<label>领域<input id="editDomain" type="text" value="${esc(node.domain||'')}" /></label>`;
    fields += `<label>L1 要求（选填）<input id="editL1" type="text" value="${esc(node.l1Req||'')}" placeholder="L1 级别的要求描述" /></label>`;
    fields += `<label>L2 要求（选填）<input id="editL2" type="text" value="${esc(node.l2Req||'')}" placeholder="L2 级别的要求描述" /></label>`;
    fields += `<label>L3 要求（选填）<input id="editL3" type="text" value="${esc(node.l3Req||'')}" placeholder="L3 级别的要求描述" /></label>`;
    fields += `<label>核心能力<select id="editCore"><option value="true" ${node.core?'selected':''}>是</option><option value="false" ${!node.core?'selected':''}>否</option></select></label>`;
    fields += `<label>行为描述<textarea id="editBehavior" rows="3">${esc(node.behaviorDesc||'')}</textarea></label>`;
    fields += `<label>评估方式<input id="editAssess" type="text" value="${esc(node.assessMethod||'')}" /></label>`;
  }
  // 上下层关系调整（仅 1/2/3 层级，参考新增节点的字段结构）
  if(tree && level === 1){
    // 编辑子行业：上层=行业（只读），下层=岗位多选
    fields += `<label>上层节点（行业）<input type="text" value="${esc(tree.name)}" disabled /></label>`;
    const allPos = [];
    (tree.subIndustries||[]).forEach(s=>(s.positions||[]).forEach(p=>allPos.push({id:p.id,name:p.name,subName:s.name,inSub:s.id===node.id})));
    if(allPos.length){
      fields += `<label>下层节点（岗位 · 勾选移入当前子行业）<div class="checkbox-group">`;
      allPos.forEach(p=>{
        fields += `<label><input type="checkbox" class="edit-child" value="${p.id}" ${p.inSub?'checked':''}> ${esc(p.name)} <span style="color:var(--text3);font-size:11px">(原属：${esc(p.subName)})</span></label>`;
      });
      fields += `</div></label>`;
    } else {
      fields += `<label>下层节点（岗位）<span style="font-size:12px;color:var(--text3)">暂无可选岗位</span></label>`;
    }
  } else if(tree && level === 2){
    // 编辑岗位：上层=子行业下拉，下层=能力项多选
    const pr = findParent(node.id, level);
    const parentSubId = pr?.parent?.id || '';
    fields += `<label>上层节点（子行业）<select id="editParentSub">`;
    (tree.subIndustries||[]).forEach(s=>{
      fields += `<option value="${s.id}" ${s.id===parentSubId?'selected':''}>${esc(s.name)}</option>`;
    });
    fields += `</select></label>`;
    const allAbl = new Map();
    (tree.subIndustries||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.abilities||[]).forEach(a=>{
      if(!allAbl.has(a.id)) allAbl.set(a.id, {id:a.id,name:a.name,posName:p.name,inPos:p.id===node.id});
    })));
    if(allAbl.size){
      fields += `<label>下层节点（能力项 · 勾选移入当前岗位）<div class="checkbox-group">`;
      [...allAbl.values()].forEach(a=>{
        fields += `<label><input type="checkbox" class="edit-child" value="${a.id}" ${a.inPos?'checked':''}> ${esc(a.name)}</label>`;
      });
      fields += `</div></label>`;
    } else {
      fields += `<label>下层节点（能力项）<span style="font-size:12px;color:var(--text3)">暂无可选能力项</span></label>`;
    }
  } else if(tree && level === 3){
    // 编辑能力项：上层=岗位下拉，无下层
    const pr = findParent(node.id, level);
    const parentPosId = pr?.parent?.id || '';
    fields += `<label>上层节点（岗位）<select id="editParentPos">`;
    (tree.subIndustries||[]).forEach(s=>(s.positions||[]).forEach(p=>{
      fields += `<option value="${p.id}" ${p.id===parentPosId?'selected':''}>${esc(p.name)}</option>`;
    }));
    fields += `</select></label>`;
  }
  $('#editNodeForm').innerHTML = fields;
  openModal('#editNodeModal');
}

if($('#submitEditNode')) $('#submitEditNode').onclick = ()=>{
  const result = findNode(editingNodeId, editingNodeLevel);
  if(!result) return;
  const { node, level } = result;
  const g = getGraph();
  const tree = g?.tree;
  // 基础属性
  node.name = $('#editName').value.trim() || node.name;
  if($('#editDesc')) node.describe = $('#editDesc').value.trim();
  if($('#editType')) node.type = $('#editType').value;
  if($('#editDomain')) node.domain = $('#editDomain').value.trim();
  if($('#editL1')){ node.l1Req = $('#editL1').value.trim(); }
  if($('#editL2')){ node.l2Req = $('#editL2').value.trim(); }
  if($('#editL3')){ node.l3Req = $('#editL3').value.trim(); node.requiredLevel = node.l3Req ? 'L3' : (node.l2Req ? 'L2' : 'L1'); }
  if($('#editCore')) node.core = $('#editCore').value === 'true';
  if($('#editBehavior')) node.behaviorDesc = $('#editBehavior').value.trim();
  if($('#editAssess')) node.assessMethod = $('#editAssess').value.trim();
  // 处理上下层关系调整
  if(tree && level === 1){
    // 编辑子行业：勾选=移入当前子行业，取消勾选=移出到其他子行业
    const cbs = [...document.querySelectorAll('#editNodeForm .edit-child')];
    const checkedIds = new Set(cbs.filter(c=>c.checked).map(c=>c.value));
    // 勾选的岗位：从其他子行业移入
    checkedIds.forEach(pid=>{
      if((node.positions||[]).find(p=>p.id===pid)) return;
      (tree.subIndustries||[]).forEach(s=>{
        if(s.id!==node.id){
          const idx=(s.positions||[]).findIndex(p=>p.id===pid);
          if(idx>-1){ node.positions=node.positions||[]; node.positions.push(s.positions.splice(idx,1)[0]); }
        }
      });
    });
    // 取消勾选的岗位：从当前子行业移出，放到第一个其他子行业
    const otherSubs=(tree.subIndustries||[]).filter(s=>s.id!==node.id);
    cbs.filter(c=>!c.checked).forEach(cb=>{
      const pid=cb.value;
      const idx=(node.positions||[]).findIndex(p=>p.id===pid);
      if(idx>-1){
        const moved=node.positions.splice(idx,1)[0];
        if(otherSubs.length){ otherSubs[0].positions=otherSubs[0].positions||[]; otherSubs[0].positions.push(moved); }
        else { node.positions.push(moved); toast('岗位必须属于一个子行业，已保留原位'); }
      }
    });
  } else if(tree && level === 2){
    // 编辑岗位：上层变更
    const newParentId=$('#editParentSub')?.value;
    if(newParentId){
      const oldPr=findParent(node.id, level);
      if(oldPr?.parent?.id !== newParentId){
        if(oldPr?.parent){
          const idx=(oldPr.parent.positions||[]).findIndex(p=>p.id===node.id);
          if(idx>-1) oldPr.parent.positions.splice(idx,1);
        }
        const newSub=(tree.subIndustries||[]).find(s=>s.id===newParentId);
        if(newSub){ newSub.positions=newSub.positions||[]; newSub.positions.push(node); }
      }
    }
    // 下层能力项：勾选=移入，取消勾选=移出到其他岗位
    const cbs=[...document.querySelectorAll('#editNodeForm .edit-child')];
    const checkedIds=new Set(cbs.filter(c=>c.checked).map(c=>c.value));
    checkedIds.forEach(aid=>{
      if((node.abilities||[]).find(a=>a.id===aid)) return;
      (tree.subIndustries||[]).forEach(s=>(s.positions||[]).forEach(p=>{
        if(p.id!==node.id){
          const idx=(p.abilities||[]).findIndex(a=>a.id===aid);
          if(idx>-1){ node.abilities=node.abilities||[]; node.abilities.push(p.abilities.splice(idx,1)[0]); }
        }
      }));
    });
    const allOtherPos=[];
    (tree.subIndustries||[]).forEach(s=>(s.positions||[]).forEach(p=>{ if(p.id!==node.id) allOtherPos.push(p); }));
    cbs.filter(c=>!c.checked).forEach(cb=>{
      const aid=cb.value;
      const idx=(node.abilities||[]).findIndex(a=>a.id===aid);
      if(idx>-1){
        const moved=node.abilities.splice(idx,1)[0];
        if(allOtherPos.length){ allOtherPos[0].abilities=allOtherPos[0].abilities||[]; allOtherPos[0].abilities.push(moved); }
        else { node.abilities.push(moved); toast('能力项必须属于一个岗位，已保留原位'); }
      }
    });
  } else if(tree && level === 3){
    // 编辑能力项：上层变更
    const newParentId=$('#editParentPos')?.value;
    if(newParentId){
      const oldPr=findParent(node.id, level);
      if(oldPr?.parent?.id !== newParentId){
        if(oldPr?.parent){
          const idx=(oldPr.parent.abilities||[]).findIndex(a=>a.id===node.id);
          if(idx>-1) oldPr.parent.abilities.splice(idx,1);
        }
        let newParent=null;
        (tree.subIndustries||[]).forEach(s=>{ const p=(s.positions||[]).find(p=>p.id===newParentId); if(p) newParent=p; });
        if(newParent){ newParent.abilities=newParent.abilities||[]; newParent.abilities.push(node); }
      }
    }
  }
  closeModal('#editNodeModal');
  toast('已保存修改');
  if(tree){ renderGraph(tree); renderTreeStats(tree); saveGraphs(); }
};

// ========== 添加子节点弹窗 ==========

// ========== 新增节点弹框 ==========
function getGraph(){ return graphs.find(x=>x.id===currentGraphId); }

function openAddNodeModal(){
  $('#newNodeName').value = '';
  $('#newNodeType').value = '1';
  $('#newNodeExtraFields').innerHTML = '';
  updateNodeParentOptions();
  openModal('#addNodeModal');
}

function updateNodeParentOptions(){
  const g = getGraph();
  if(!g || !g.tree) return;
  const type = parseInt($('#newNodeType').value);
  const tree = g.tree;
  let parents = [];
  let children = [];
  if(type === 1){ // 子行业 → 上层=行业, 下层=岗位
    parents = [{id:tree.id, name:tree.name}];
    children = [];
    (tree.subIndustries||[]).forEach(s=>{ (s.positions||[]).forEach(p=>children.push({id:p.id,name:p.name})) });
  } else if(type === 2){ // 岗位 → 上层=子行业, 下层=能力项
    const ablSet = new Map();
    (tree.subIndustries||[]).forEach(s=>{
      parents.push({id:s.id, name:s.name});
      (s.positions||[]).forEach(p=>{
        (p.abilities||[]).forEach(a=>{
          if(!ablSet.has(a.id)) ablSet.set(a.id, {id:a.id,name:a.name,requiredLevel:a.requiredLevel});
        });
      });
    });
    children = [...ablSet.values()];
  } else if(type === 3){ // 能力项 → 上层=岗位, 无下层
    (tree.subIndustries||[]).forEach(s=>{
      (s.positions||[]).forEach(p=>parents.push({id:p.id,name:p.name}));
    });
    children = [];
  }
  // 填充上层节点下拉
  $('#newNodeParent').innerHTML = parents.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  // 能力项类型：隐藏下层节点
  $('#newNodeChildrenWrap').style.display = type === 3 ? 'none' : 'block';
  // 更新标签文案
  const lbl = document.querySelector('#newNodeChildrenLabel');
  if(lbl) lbl.firstChild.nodeValue = type === 2 ? '能力项（可多选）' : '下层节点（可多选）';
  // 填充下层节点多选
  if(children.length){
    if(type === 2){
      // 岗位：每个能力项附带 L1/L2/L3 勾选
      $('#newNodeChildren').innerHTML = children.map(c=>{
        const lvl = '';
        const l1Chk = lvl === 'L1' ? 'checked' : '';
        const l2Chk = lvl === 'L2' ? 'checked' : '';
        const l3Chk = lvl === 'L3' ? 'checked' : '';
        return `<div class="ability-select-row" data-id="${c.id}" style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f0f0f0;">
          <label style="flex:1;display:flex;align-items:center;gap:6px;"><input type="checkbox" class="abi-check" value="${c.id}" onclick="autoSelectL2(this)"> ${c.name}</label>
          <span style="display:flex;gap:6px;">
            <label style="font-size:12px;display:flex;align-items:center;gap:2px;"><input type="radio" class="abi-level" name="lvl-${c.id}" value="L1" ${l1Chk}> L1</label>
            <label style="font-size:12px;display:flex;align-items:center;gap:2px;"><input type="radio" class="abi-level" name="lvl-${c.id}" value="L2" ${l2Chk}> L2</label>
            <label style="font-size:12px;display:flex;align-items:center;gap:2px;"><input type="radio" class="abi-level" name="lvl-${c.id}" value="L3" ${l3Chk}> L3</label>
          </span>
        </div>`;
      }).join('');
    } else {
      $('#newNodeChildren').innerHTML = children.map(c=>`<label><input type="checkbox" value="${c.id}"> ${c.name}</label>`).join('');
    }
  } else {
    $('#newNodeChildren').innerHTML = '<span style="font-size:12px;color:var(--text3)">暂无可选下层节点</span>';
  }
  // 能力项额外字段
  if(type === 3){
    // 收集当前图谱中所有已存在的能力项作为前置能力候选
    const allAbi = [];
    (g?.tree?.subIndustries||[]).forEach(sub=>(sub.positions||[]).forEach(pos=>(pos.abilities||[]).forEach(ab=>allAbi.push({id:ab.id,name:ab.name}))));
    const prereqOpts = allAbi.map(a=>`<label><input type="checkbox" value="${a.id}"> ${a.name}</label>`).join('');
    $('#newNodeExtraFields').innerHTML = `
      <label>类型<select id="newNodeAbiType"><option value="knowledge">知识</option><option value="skill">技能</option><option value="attitude">素养</option></select></label>
      <label>领域<input id="newNodeDomain" type="text" placeholder="如：产品策划与行程设计" /></label>
      <div style="margin-bottom:15px;border-left:3px solid #5149e9;padding-left:10px;">
        <div style="color:var(--text2);font-size:12px;font-weight:600;margin-bottom:7px;">L1 要求</div>
        <label>描述（必输）<input id="newNodeL1" type="text" placeholder="L1 级别的要求描述" /></label>
        <label>建议考核方式<input id="newNodeL1Assess" type="text" placeholder="如：模拟讲解考核" /></label>
      </div>
      <div id="newL2Block" style="display:none;margin-bottom:15px;border-left:3px solid #5149e9;padding-left:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;color:var(--text2);font-size:12px;font-weight:600;margin-bottom:7px;">L2 要求 <button type="button" onclick="removeLevel('newL2Block','newL2AddBtn')" style="border:none;background:none;color:#f44;cursor:pointer;font-size:12px;">× 删除</button></div>
        <label>描述<input id="newNodeL2" type="text" placeholder="L2 级别的要求描述" /></label>
        <label>建议考核方式<input id="newNodeL2Assess" type="text" placeholder="如：方案评审" /></label>
      </div>
      <div id="newL3Block" style="display:none;margin-bottom:15px;border-left:3px solid #5149e9;padding-left:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;color:var(--text2);font-size:12px;font-weight:600;margin-bottom:7px;">L3 要求 <button type="button" onclick="removeLevel('newL3Block','newL3AddBtn')" style="border:none;background:none;color:#f44;cursor:pointer;font-size:12px;">× 删除</button></div>
        <label>描述<input id="newNodeL3" type="text" placeholder="L3 级别的要求描述" /></label>
        <label>建议考核方式<input id="newNodeL3Assess" type="text" placeholder="如：限时实操考核" /></label>
      </div>
      <div style="margin-bottom:15px;display:flex;gap:8px;">
        <button type="button" id="newL2AddBtn" onclick="addLevel('newL2Block','newL2AddBtn')" style="border:1px solid #5149e9;color:#5149e9;background:#fff;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer;">+ 增加 L2</button>
        <button type="button" id="newL3AddBtn" onclick="addLevel('newL3Block','newL3AddBtn')" style="border:1px solid #5149e9;color:#5149e9;background:#fff;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer;">+ 增加 L3</button>
      </div>
      <label>核心能力<select id="newNodeCore"><option value="false">否</option><option value="true">是</option></select></label>
      <div style="margin-bottom:15px;"><span style="display:block;color:var(--text2);font-size:12px;font-weight:600;">前置能力项（选填，可多选）</span><div id="newNodePrereq" class="checkbox-group" style="margin-top:7px;">${prereqOpts || '<span style="font-size:12px;color:#999;">暂无可选能力项</span>'}</div></div>
      <label>行为描述<textarea id="newNodeBehavior" rows="2" placeholder="描述该能力项的可观察行为（可选）"></textarea></label>`;
  } else {
    $('#newNodeExtraFields').innerHTML = '<label>描述<textarea id="newNodeDesc" rows="2" placeholder="描述（可选）"></textarea></label>';
  }
}

$('#addNodeBtn')?.addEventListener('click', openAddNodeModal);
$('#newNodeType')?.addEventListener('change', updateNodeParentOptions);

$('#submitAddNode')?.addEventListener('click', ()=>{
  const g = getGraph();
  if(!g || !g.tree) return toast('请先打开图谱');
  const name = $('#newNodeName').value.trim();
  if(!name) return toast('请输入节点名称');
  const type = parseInt($('#newNodeType').value);
  const parentId = $('#newNodeParent').value;
  const tree = g.tree;
  const newNode = { id: uid(), name };

  if(type === 1){ // 子行业
    newNode.describe = ($('#newNodeDesc')?.value || '').trim();
    newNode.positions = [];
    // 找到选中的下层节点（岗位），移动到这个新子行业下
    const selectedChildIds = [...$('#newNodeChildren').querySelectorAll('input:checked')].map(c=>c.value);
    newNode.positions = selectedChildIds.map(cid => {
      let found = null;
      (tree.subIndustries||[]).forEach(s=>{
        const idx = (s.positions||[]).findIndex(p=>p.id===cid);
        if(idx>-1){ found = s.positions.splice(idx,1)[0]; }
      });
      return found;
    }).filter(Boolean);
    tree.subIndustries = tree.subIndustries || [];
    tree.subIndustries.push(newNode);
  } else if(type === 2){ // 岗位
    newNode.describe = ($('#newNodeDesc')?.value || '').trim();
    newNode.careerLevel = '';
    newNode.abilities = [];
    // 找到选中的能力项，链接到新岗位并更新 L1/L2/L3
    const rows = [...$('#newNodeChildren').querySelectorAll('.ability-select-row')];
    rows.forEach(row => {
      const check = row.querySelector('.abi-check');
      if(!check || !check.checked) return;
      const cid = check.value;
      let found = null;
      (tree.subIndustries||[]).forEach(s=>{
        (s.positions||[]).forEach(p=>{
          const idx = (p.abilities||[]).findIndex(a=>a.id===cid);
          if(idx>-1){ found = p.abilities.splice(idx,1)[0]; }
        });
      });
      if(!found) return;
      // 读取单选等级，默认 L2
      const levelRadio = row.querySelector('.abi-level:checked');
      found.requiredLevel = levelRadio ? levelRadio.value : 'L2';
      newNode.abilities.push(found);
    });
    // 找到父节点（子行业），添加岗位
    const sub = (tree.subIndustries||[]).find(s=>s.id===parentId);
    if(sub){ sub.positions = sub.positions || []; sub.positions.push(newNode); }
  } else if(type === 3){ // 能力项
    const l1 = ($('#newNodeL1')?.value || '').trim();
    if(!l1) return toast('L1 描述为必输项');
    const l2Vis = $('#newL2Block')?.style.display !== 'none';
    const l3Vis = $('#newL3Block')?.style.display !== 'none';
    const l2 = l2Vis ? ($('#newNodeL2')?.value || '').trim() : '';
    const l3 = l3Vis ? ($('#newNodeL3')?.value || '').trim() : '';
    newNode.type = $('#newNodeAbiType').value;
    newNode.domain = $('#newNodeDomain').value.trim();
    newNode.l1Req = l1;
    newNode.l1AssessMethod = ($('#newNodeL1Assess')?.value || '').trim();
    newNode.l2Req = l2;
    newNode.l2AssessMethod = l2Vis ? ($('#newNodeL2Assess')?.value || '').trim() : '';
    newNode.l3Req = l3;
    newNode.l3AssessMethod = l3Vis ? ($('#newNodeL3Assess')?.value || '').trim() : '';
    newNode.requiredLevel = (l3Vis && l3) ? 'L3' : ((l2Vis && l2) ? 'L2' : 'L1');
    newNode.core = $('#newNodeCore').value === 'true';
    newNode.behaviorDesc = $('#newNodeBehavior').value.trim();
    newNode.assessMethod = newNode.l1AssessMethod || '';
    newNode.inferred = false;
    newNode.flag = null;
    const prereqBox = $('#newNodePrereq');
    newNode.prerequisites = prereqBox ? [...prereqBox.querySelectorAll('input:checked')].map(c=>c.value) : [];
    // 找到父节点（岗位），添加能力项
    let parentPos = null;
    (tree.subIndustries||[]).forEach(s=>{
      const p = (s.positions||[]).find(p=>p.id===parentId);
      if(p) parentPos = p;
    });
    if(parentPos){ parentPos.abilities = parentPos.abilities || []; parentPos.abilities.push(newNode); }
  }
  closeModal('#addNodeModal');
  toast('已添加节点：' + name);
  renderGraph(tree);
  renderTreeStats(tree);
  renderList();
  saveGraphs();
});

$('#cancelAddNode')?.addEventListener('click', ()=>closeModal('#addNodeModal'));
$('#closeAddNode')?.addEventListener('click', ()=>closeModal('#addNodeModal'));
$('#addNodeModal')?.addEventListener('click', e=>{ if(e.target.id==='addNodeModal') closeModal('#addNodeModal'); });


let addChildParentId = null, addChildLevel = -1;

function openAddChild(parentId, level){
  addChildParentId = parentId;
  addChildLevel = level;
  const result = findNode(parentId, level);
  if(!result) return;
  const g = getGraph();
  const tree = g?.tree;
  const childLabels = ['子行业','岗位','能力项'];
  $('#addChildTitle').textContent = '添加' + childLabels[level];
  let fields = `<label>名称<input id="addChildName" type="text" placeholder="请输入${childLabels[level]}名称" /></label>`;

  if(level === 0){
    // 子行业：下层节点（岗位可多选）
    const positions = [];
    (tree?.subIndustries||[]).forEach(s=>(s.positions||[]).forEach(p=>positions.push({id:p.id,name:p.name})));
    const posHtml = positions.length
      ? positions.map(p=>`<label><input type="checkbox" class="child-check" value="${p.id}"> ${p.name}</label>`).join('')
      : '<span style="font-size:12px;color:#999;">暂无可选岗位</span>';
    fields += `<label>下层节点（岗位 · 可多选）<div class="checkbox-group">${posHtml}</div></label>`;
    fields += `<label>描述<textarea id="addChildDesc" rows="3" placeholder="描述（可选）"></textarea></label>`;
  }

  if(level === 1){
    // 岗位：能力项（可多选）附带 L1/L2/L3 单选
    const ablSet = new Map();
    (tree?.subIndustries||[]).forEach(s=>(s.positions||[]).forEach(p=>(p.abilities||[]).forEach(a=>{
      if(!ablSet.has(a.id)) ablSet.set(a.id, {id:a.id,name:a.name,requiredLevel:a.requiredLevel});
    })));
    const abilities = [...ablSet.values()];
    const abiHtml = abilities.length
      ? abilities.map(c=>{
          const lvl = '';
          const l1Chk = lvl === 'L1' ? 'checked' : '';
          const l2Chk = lvl === 'L2' ? 'checked' : '';
          const l3Chk = lvl === 'L3' ? 'checked' : '';
          return `<div class="ability-select-row" data-id="${c.id}" style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid #f0f0f0;">
            <label style="flex:1;display:flex;align-items:center;gap:6px;"><input type="checkbox" class="abi-check" value="${c.id}" onclick="autoSelectL2(this)"> ${c.name}</label>
            <span style="display:flex;gap:6px;">
              <label style="font-size:12px;display:flex;align-items:center;gap:2px;"><input type="radio" class="abi-level" name="lvl-${c.id}" value="L1" ${l1Chk}> L1</label>
              <label style="font-size:12px;display:flex;align-items:center;gap:2px;"><input type="radio" class="abi-level" name="lvl-${c.id}" value="L2" ${l2Chk}> L2</label>
              <label style="font-size:12px;display:flex;align-items:center;gap:2px;"><input type="radio" class="abi-level" name="lvl-${c.id}" value="L3" ${l3Chk}> L3</label>
            </span>
          </div>`;
        }).join('')
      : '<span style="font-size:12px;color:#999;">暂无可选能力项</span>';
    fields += `<label>能力项（可多选）<div id="addChildAbilities">${abiHtml}</div></label>`;
    fields += `<label>描述<textarea id="addChildDesc" rows="3" placeholder="描述（可选）"></textarea></label>`;
  }

  if(level === 2){
    // 能力项：与新增节点弹框完全一致
    fields += `<label>类型<select id="addChildType"><option value="knowledge">知识</option><option value="skill">技能</option><option value="attitude">素养</option></select></label>`;
    fields += `<label>领域<input id="addChildDomain" type="text" placeholder="如：产品策划与行程设计" /></label>`;
    fields += `<div style="margin-bottom:15px;border-left:3px solid #5149e9;padding-left:10px;">
      <div style="color:var(--text2);font-size:12px;font-weight:600;margin-bottom:7px;">L1 要求</div>
      <label>描述（必输）<input id="addChildL1" type="text" placeholder="L1 级别的要求描述" /></label>
      <label>建议考核方式<input id="addChildL1Assess" type="text" placeholder="如：模拟讲解考核" /></label>
    </div>
    <div id="childL2Block" style="display:none;margin-bottom:15px;border-left:3px solid #5149e9;padding-left:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;color:var(--text2);font-size:12px;font-weight:600;margin-bottom:7px;">L2 要求 <button type="button" onclick="removeLevel('childL2Block','childL2AddBtn')" style="border:none;background:none;color:#f44;cursor:pointer;font-size:12px;">× 删除</button></div>
      <label>描述<input id="addChildL2" type="text" placeholder="L2 级别的要求描述" /></label>
      <label>建议考核方式<input id="addChildL2Assess" type="text" placeholder="如：方案评审" /></label>
    </div>
    <div id="childL3Block" style="display:none;margin-bottom:15px;border-left:3px solid #5149e9;padding-left:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;color:var(--text2);font-size:12px;font-weight:600;margin-bottom:7px;">L3 要求 <button type="button" onclick="removeLevel('childL3Block','childL3AddBtn')" style="border:none;background:none;color:#f44;cursor:pointer;font-size:12px;">× 删除</button></div>
      <label>描述<input id="addChildL3" type="text" placeholder="L3 级别的要求描述" /></label>
      <label>建议考核方式<input id="addChildL3Assess" type="text" placeholder="如：限时实操考核" /></label>
    </div>
    <div style="margin-bottom:15px;display:flex;gap:8px;">
      <button type="button" id="childL2AddBtn" onclick="addLevel('childL2Block','childL2AddBtn')" style="border:1px solid #5149e9;color:#5149e9;background:#fff;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer;">+ 增加 L2</button>
      <button type="button" id="childL3AddBtn" onclick="addLevel('childL3Block','childL3AddBtn')" style="border:1px solid #5149e9;color:#5149e9;background:#fff;border-radius:6px;padding:4px 12px;font-size:12px;cursor:pointer;">+ 增加 L3</button>
    </div>`;
    fields += `<label>核心能力<select id="addChildCore"><option value="false">否</option><option value="true">是</option></select></label>`;
    const allAbilities = [];
    (g?.tree?.subIndustries||[]).forEach(sub=>(sub.positions||[]).forEach(pos=>(pos.abilities||[]).forEach(ab=>allAbilities.push({id:ab.id,name:ab.name}))));
    const prereqOptions = allAbilities.map(a=>`<label><input type="checkbox" value="${a.id}"> ${a.name}</label>`).join('');
    fields += `<div style="margin-bottom:15px;"><span style="display:block;color:var(--text2);font-size:12px;font-weight:600;">前置能力项（选填，可多选）</span><div id="addChildPrereq" class="checkbox-group" style="margin-top:7px;">${prereqOptions || '<span style="font-size:12px;color:#999;">暂无可选能力项</span>'}</div></div>`;
    fields += `<label>行为描述<textarea id="addChildBehavior" rows="3" placeholder="描述该能力项的可观察行为（可选）"></textarea></label>`;
  }
  $('#addChildForm').innerHTML = fields;
  openModal('#addChildModal');
}

if($('#submitAddChild')) $('#submitAddChild').onclick = ()=>{
  const name = $('#addChildName').value.trim();
  if(!name) return toast('请输入名称');
  const result = findNode(addChildParentId, addChildLevel);
  if(!result) return;
  const node = result.node;
  const child = { id: uid(), name };
  const g = graphs.find(x=>x.id===currentGraphId);
  const tree = g?.tree;

  if(addChildLevel === 0){
    // 子行业
    child.describe = ($('#addChildDesc')?.value || '').trim();
    child.positions = [];
    // 找到选中的岗位，移动到这个新子行业下
    const selectedIds = [...$('#addChildForm').querySelectorAll('.child-check:checked')].map(c=>c.value);
    selectedIds.forEach(cid => {
      let found = null;
      (tree?.subIndustries||[]).forEach(s=>{
        const idx = (s.positions||[]).findIndex(p=>p.id===cid);
        if(idx>-1){ found = s.positions.splice(idx,1)[0]; }
      });
      if(found) child.positions.push(found);
    });
  }

  if(addChildLevel === 1){
    // 岗位
    child.describe = ($('#addChildDesc')?.value || '').trim();
    child.careerLevel = '';
    child.abilities = [];
    // 找到选中的能力项，移动到新岗位并设置等级
    const rows = [...$('#addChildForm').querySelectorAll('.ability-select-row')];
    rows.forEach(row => {
      const check = row.querySelector('.abi-check');
      if(!check || !check.checked) return;
      const cid = check.value;
      let found = null;
      (tree?.subIndustries||[]).forEach(s=>{
        (s.positions||[]).forEach(p=>{
          const idx = (p.abilities||[]).findIndex(a=>a.id===cid);
          if(idx>-1){ found = p.abilities.splice(idx,1)[0]; }
        });
      });
      if(!found) return;
      const levelRadio = row.querySelector('.abi-level:checked');
      found.requiredLevel = levelRadio ? levelRadio.value : 'L2';
      child.abilities.push(found);
    });
  }

  if(addChildLevel === 2){
    // 能力项
    const l1 = ($('#addChildL1')?.value || '').trim();
    if(!l1) return toast('L1 描述为必输项');
    const l2Vis = $('#childL2Block')?.style.display !== 'none';
    const l3Vis = $('#childL3Block')?.style.display !== 'none';
    const l2 = l2Vis ? ($('#addChildL2')?.value || '').trim() : '';
    const l3 = l3Vis ? ($('#addChildL3')?.value || '').trim() : '';
    child.type = $('#addChildType').value;
    child.domain = $('#addChildDomain').value.trim();
    child.l1Req = l1;
    child.l1AssessMethod = ($('#addChildL1Assess')?.value || '').trim();
    child.l2Req = l2;
    child.l2AssessMethod = l2Vis ? ($('#addChildL2Assess')?.value || '').trim() : '';
    child.l3Req = l3;
    child.l3AssessMethod = l3Vis ? ($('#addChildL3Assess')?.value || '').trim() : '';
    child.requiredLevel = (l3Vis && l3) ? 'L3' : ((l2Vis && l2) ? 'L2' : 'L1');
    child.core = $('#addChildCore').value === 'true';
    child.behaviorDesc = $('#addChildBehavior').value.trim();
    child.assessMethod = child.l1AssessMethod || '';
    const prereqBox = $('#addChildPrereq');
    child.prerequisites = prereqBox ? [...prereqBox.querySelectorAll('input:checked')].map(c=>c.value) : [];
    child.inferred = false;
    child.flag = null;
  }
  const children = getNodeChildren(node, addChildLevel) || [];
  children.push(child);
  setNodeChildren(node, addChildLevel, children);
  expandedNodes.add(node.id);
  closeModal('#addChildModal');
  toast('已添加' + (addChildLevel===0?'子行业':addChildLevel===1?'岗位':'能力项'));
  renderTree(tree);
  renderTreeStats(tree);
  saveGraphs();
};

// ========== 弹窗通用 ==========
function openModal(sel){ $(sel).classList.add('open'); $(sel).setAttribute('aria-hidden','false'); }
function closeModal(sel){ $(sel).classList.remove('open'); $(sel).setAttribute('aria-hidden','true'); }

if($('#closeEditNode')) $('#closeEditNode').onclick = ()=>closeModal('#editNodeModal');
if($('#cancelEditNode')) $('#cancelEditNode').onclick = ()=>closeModal('#editNodeModal');
if($('#closeAddChild')) $('#closeAddChild').onclick = ()=>closeModal('#addChildModal');
if($('#cancelAddChild')) $('#cancelAddChild').onclick = ()=>closeModal('#addChildModal');
if($('#editNodeModal')) $('#editNodeModal').onclick = e=>{if(e.target.id==='editNodeModal')closeModal('#editNodeModal')};
if($('#addChildModal')) $('#addChildModal').onclick = e=>{if(e.target.id==='addChildModal')closeModal('#addChildModal')};

// ========== 新增能力图谱 ==========
if($('#createGraphButton')) $('#createGraphButton').onclick = ()=>openModal('#createGraphModal');
if($('#closeCreateGraph')) $('#closeCreateGraph').onclick = ()=>closeModal('#createGraphModal');
if($('#cancelCreateGraph')) $('#cancelCreateGraph').onclick = ()=>closeModal('#createGraphModal');

if($('#manualCreateGraph')) $('#manualCreateGraph').onclick = ()=>{
  const name = $('#newGraphName').value.trim();
  const desc = $('#newGraphDesc').value.trim();
  if(!name) return toast('请输入行业名称');
  closeModal('#createGraphModal');
  // 手动创建：直接生成空树骨架，不经过 AI 构建
  const newId = uid();
  const newTree = { id:uid(), name, aliases:[], describe:desc, info:{stats:{positions:0,distinctAbilities:0,subIndustries:0}}, subIndustries:[] };
  graphs.push({ id:newId, name, describe:desc, status:'built', createdAt:new Date().toISOString().slice(0,10), stats:{positions:0,abilities:0,subIndustries:0}, tree:newTree });
  renderList();
  saveGraphs();
  toast('已创建空能力图谱，请手动添加节点');
};
if($('#createGraphModal')) $('#createGraphModal').onclick = e=>{if(e.target.id==='createGraphModal')closeModal('#createGraphModal')};

if($('#submitCreateGraph')) $('#submitCreateGraph').onclick = ()=>{
  const name = $('#newGraphName').value.trim();
  const desc = $('#newGraphDesc').value.trim();
  if(!name) return toast('请输入行业名称');
  
  closeModal('#createGraphModal');
  // 显示AI构建中
  showBuildingAnimation(name, desc);
};

function showBuildingAnimation(name, desc){
  $('#treeView').style.display = 'none';
  $('#listView').style.display = 'block';
  // 添加构建中的卡片
  const tempId = 'temp-' + uid();
  graphs.push({ id:tempId, name, describe:desc, status:'building', createdAt:new Date().toISOString().slice(0,10), stats:{positions:0,abilities:0,subIndustries:0}, tree:null });
  renderList();
  // 模拟AI构建过程
  const card = document.querySelector(`[data-graph="${tempId}"]`);
  if(card) card.querySelector('.graph-card-stats').innerHTML = '<div class="loading-overlay"><div class="loading-spinner"></div><div class="loading-text">AI 正在分析行业语料并构建能力图谱…</div></div>';
  setTimeout(()=>{
    const idx = graphs.findIndex(g=>g.id===tempId);
    if(idx===-1) return;
    // 模拟30%概率构建失败
    if(Math.random() < 0.3){
      graphs[idx].status = 'failed';
      renderList();
      saveGraphs();
      toast('AI 构建失败，请重新构建');
      return;
    }
    // 构建完成，生成空树骨架
    const newTree = { id:uid(), name, aliases:[], describe:desc, info:{stats:{positions:0,distinctAbilities:0,subIndustries:0}}, subIndustries:[] };
    graphs[idx].status = 'built';
    graphs[idx].tree = newTree;
    graphs[idx].stats = { positions:0, abilities:0, subIndustries:0 };
    renderList();
    saveGraphs();
    toast('AI 已完成能力图谱构建，请进入编辑');
  }, 3000);
};

// 重新构建图谱
function rebuildGraph(graphId){
  const g = graphs.find(x=>x.id===graphId);
  if(!g) return;
  g.status = 'building';
  g.tree = null;
  g.stats = { positions:0, abilities:0, subIndustries:0 };
  renderList();
  // 显示构建中动画
  const card = document.querySelector(`[data-graph="${graphId}"]`);
  if(card) card.querySelector('.graph-card-stats').innerHTML = '<div class="loading-overlay"><div class="loading-spinner"></div><div class="loading-text">AI 正在分析行业语料并构建能力图谱…</div></div>';
  setTimeout(()=>{
    const idx = graphs.findIndex(x=>x.id===graphId);
    if(idx===-1) return;
    if(Math.random() < 0.3){
      graphs[idx].status = 'failed';
      renderList();
      saveGraphs();
      toast('AI 构建失败，请重新构建');
      return;
    }
    const newTree = { id:uid(), name:g.name, aliases:[], describe:g.describe, info:{stats:{positions:0,distinctAbilities:0,subIndustries:0}}, subIndustries:[] };
    graphs[idx].status = 'built';
    graphs[idx].tree = newTree;
    graphs[idx].stats = { positions:0, abilities:0, subIndustries:0 };
    renderList();
    saveGraphs();
    toast('AI 已完成能力图谱构建，请进入编辑');
  }, 3000);
}

// ========== 详情页按钮 ==========
if($('#confirmGraphBtn')) $('#confirmGraphBtn').onclick = ()=>{ if(currentGraphId) confirmGraph(currentGraphId); };
if($('#saveGraphBtn')) $('#saveGraphBtn').onclick = ()=>{
  saveGraphs();
  // 重新计算统计
  const g = graphs.find(x=>x.id===currentGraphId);
  if(g && g.tree){
    let posCount=0, ablCount=0;
    const ablSet = new Set();
    (g.tree.subIndustries||[]).forEach(s=>{
      posCount += (s.positions||[]).length;
      (s.positions||[]).forEach(p=>(p.abilities||[]).forEach(a=>{ ablCount++; ablSet.add(a.id); }));
    });
    g.stats = { subIndustries:(g.tree.subIndustries||[]).length, positions:posCount, abilities:ablSet.size };
    renderTreeStats(g.tree);
  }
  toast('已保存');
};

// HTML转义
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// 点击空白处关闭右键菜单
document.addEventListener('click', e => {
  if(!e.target.closest('.context-menu') && !e.target.closest('g.gnode')) hideContextMenu();
});
document.addEventListener('scroll', hideContextMenu, true);
window.addEventListener('resize', hideContextMenu);

// 编辑图谱弹窗事件（仅列表页）
if($('#submitEditGraph')){
  $('#submitEditGraph').onclick = ()=>{
    const g = graphs.find(x=>x.id===editingGraphId);
    if(!g) return;
    const name = $('#editGraphName').value.trim();
    if(!name) return toast('请输入图谱名称');
    g.name = name;
    g.describe = $('#editGraphDesc').value.trim();
    // 同步树根节点名称
    if(g.tree) g.tree.name = name;
    saveGraphs(); renderList(); closeModal('#editGraphModal'); toast('已保存图谱信息');
  };
  $('#closeEditGraph').onclick = ()=>closeModal('#editGraphModal');
  $('#cancelEditGraph').onclick = ()=>closeModal('#editGraphModal');
  $('#editGraphModal').onclick = e=>{ if(e.target.id==='editGraphModal') closeModal('#editGraphModal'); };
}
if($('#closeGraphSettings')){
  $('#closeGraphSettings').onclick = ()=>closeModal('#graphSettingsModal');
  $('#cancelGraphSettings').onclick = ()=>closeModal('#graphSettingsModal');
  $('#submitGraphSettings').onclick = ()=>{
    const g = graphs.find(x=>x.id===currentSettingsGraphId);
    if(!g){ closeModal('#graphSettingsModal'); return; }
    const desc = $('#settingsDesc')?.value?.trim();
    if(desc !== undefined) g.describe = desc;
    // 收集权限
    g.permissions = {
      view: [...document.querySelectorAll('.perm-view:checked')].map(c=>c.value),
      edit: [...document.querySelectorAll('.perm-edit:checked')].map(c=>c.value),
      confirm: [...document.querySelectorAll('.perm-confirm:checked')].map(c=>c.value),
    };
    saveGraphs(); renderList(); closeModal('#graphSettingsModal'); toast('设置已保存');
  };
  $('#graphSettingsModal').onclick = e=>{ if(e.target.id==='graphSettingsModal') closeModal('#graphSettingsModal'); };
}

// 页面初始化：根据当前页面元素决定执行列表页还是详情页
if($('#graphList')){
  // 列表页
  const hadData = loadGraphs();
  // 确保示例数据中的构建失败卡片存在
  if(!graphs.find(g=>g.id==='g4' && g.status==='failed')){
    graphs = graphs.filter(g=>g.id!=='g4');
    graphs.push({ id:'g4', name:'物流行业', describe:'以仓储管理、运输调度与供应链协同为核心能力体系。', status:'failed', createdAt:'2026-09-12', stats:{positions:0,abilities:0,subIndustries:0}, tree:null });
    saveGraphs();
  }
  renderList();
} else if($('#treeContainer')){
  // 详情页
  initTreePage();
}
