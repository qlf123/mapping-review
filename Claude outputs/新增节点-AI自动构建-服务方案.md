# 新增节点 · AI 自动构建 · 服务方案

> **范围**：只管「⚡ AI自动构建」按钮点下去之后的事。页面交互、弹框字段、节点增删改由页面 PRD 负责，本方案不重复。
> **对应代码**：`ability-graph.js` 的 `aiBuildNewChildren()` / `aiBuildAddChildren()` / `generateAIChildren()` —— 现在是 `setTimeout(1500)` + 硬编码模板的前端模拟，本方案就是把这三个函数换成真实服务后，服务端要做什么。
> **依赖**：《能力图谱增量节点构建方案 V2.2》的节点定义（M0~C6、S1~C1.5），本文不重复贴 prompt，只标节点编号。

---

## 一、页面实际给出的四条触发链路

读了 `ability-graph.js`，按钮实际会在四种情况下被点到。四种的输入和期望产出都不同，服务端要分开处理：

| # | 入口 | 触发函数 | 新增的是 | 父节点 | AI 要产出 | 现在的 mock |
|---|---|---|---|---|---|---|
| **L1** | 新增节点弹框 · 类型=子行业<br>或 添加子节点 · 父=行业 | `aiBuildNewChildren()` type=1<br>`aiBuildAddChildren()` level=0 | 子行业 | 行业 | **岗位清单 + 每个岗位的全部能力项**（两层） | `aiGeneratePositions()` 返回「XX主管/专员/助理…」5 条模板 |
| **L2** | 新增节点弹框 · 类型=岗位<br>或 添加子节点 · 父=子行业 | `aiBuildNewChildren()` type=2<br>`aiBuildAddChildren()` level=1 | 岗位 | 子行业 | **该岗位的全部能力项**（一层） | `aiGenerateAbilities()` 返回 8 条「XX专业知识储备」模板 |
| **L3** | 新增节点弹框 · 类型=能力项<br>或 添加子节点 · 父=岗位 | `aiBuildNewChildren()` type=3<br>`aiBuildAddChildren()` level=2 | 能力项 | 岗位 | **不建子节点，只补本条自己的字段**：类型、领域、L1/L2/L3 要求与考核方式、行为描述 | 拼字符串「了解 XX 的基本概念和术语」 |

L3 和前两条性质不同：**它不是"往下建"，是"把用户填的一行补成一条合规的能力项"**。服务端要按两类接口设计，不要硬塞进一个。

另外页面已有一个重要输入，现在的 mock 完全没用上：

> **「下层节点（可多选）」** —— 新增岗位时可以勾选已有能力项并逐条指定 L1/L2/L3；新增子行业时可以勾选已有岗位。

**这等于用户已经手工完成了一部分归并判定。** 服务端必须尊重它：用户勾了的直接建立关系、不再判定，AI 只负责补用户没勾的部分。这条写进接口契约的 `presetChildren`。

---

## 二、接口契约

### 2.1 必须改成异步（这一条会倒逼前端改）

现在是 `setTimeout(..., 1500)` 同步返回。真实链路的耗时：

| 链路 | 真实耗时 | 说明 |
|---|---|---|
| L1 建子行业（含 2~4 个岗位） | **3~6 分钟** | 每个岗位要联网检索 + 抽取 |
| L2 建岗位 | **40~90 秒** | 1~2 次检索 + 1 次抽取 + 1 次归并 |
| L3 补一条能力项 | **20~40 秒** | 1 次检索 + 1 次生成 |

按钮 disabled 干等 6 分钟没人能接受，浏览器和网关也大概率先超时。所以接口是**提交任务 + 查询状态**两个，不是一个同步接口。这是本方案唯一需要前端配合改的交互点，其余照页面 PRD 不动。

### 2.2 提交构建

```
POST /api/ability-graph/{graphId}/ai-build
```

```jsonc
{
  "nodeType": 2,                    // 1 子行业 | 2 岗位 | 3 能力项，与页面 newNodeType 同值
  "name": "OTA产品运营专员",         // 用户填的名称，必填
  "parentId": "n11",                // 页面 newNodeParent / addChildParentId，必填
  "describe": "负责平台商品与流量运营", // 选填，用户填了就作为岗位定位注入，没填 AI 自己判断
  "presetChildren": [               // 用户在「下层节点」里勾选的已有节点
    { "id": "n13", "requiredLevel": "L2" },   // nodeType=2 时带等级
    { "id": "n14", "requiredLevel": "L3" }
  ],
  "abilityDraft": {                 // 仅 nodeType=3 时有，把用户已填的字段带上，AI 只补空的
    "type": "skill", "domain": "", "core": false,
    "l1Req": "", "l1AssessMethod": "",
    "l2Req": "", "l2AssessMethod": "",
    "l3Req": "", "l3AssessMethod": "",
    "behaviorDesc": "", "prerequisites": []
  },
  "clientRequestId": "…"            // 幂等键，同一个键重复提交返回同一个任务
}
```

返回：

```jsonc
{ "taskId": "bt_20260920_0007", "estimatedSeconds": 75 }
```

`estimatedSeconds` 按 nodeType 给固定估值即可（L1=300、L2=75、L3=30），前端拿它做进度条，不必精确。

### 2.3 查询状态

```
GET /api/ability-graph/ai-build/{taskId}
```

```jsonc
{
  "taskId": "bt_20260920_0007",
  "status": "running",              // queued | running | needs_input | succeeded | failed
  "phase": "抽取岗位职责与能力项",    // 给前端直接显示的一句话，见下表
  "progress": 0.55,
  "result": null,                   // succeeded 时才有，结构见第四节
  "error": null
}
```

`phase` 用人话，不要回传 `N3`、`C1.5` 这种内部节点名：

| 内部节点 | 回传给前端的 phase |
|---|---|
| M1 | 正在校验节点 |
| M2 | 正在规划岗位 |
| S1 / C1 / S2 / C1b | 正在检索行业资料 |
| N3 / M3 | 正在抽取职责与能力项 |
| C1.5 | 正在核对来源 |
| C3.5 / M4 | 正在与已有能力比对 |
| C4 / C5 | 正在整理结果 |

`needs_input` 是两种情况：命中查重被拦下（`blocked`）、或资料不足需要用户补材料（`needs_material`），详见第六节。

**状态复用现成的枚举**：图谱本身已有 `status: building | built | failed`，构建任务期间把图谱置 `building`，页面已有的"构建中"徽标可直接复用，不用新做一套。

---

## 三、四条链路的构建管线

节点编号对应 V2.2 方案，prompt 不在这里重复。

```
L1  新增子行业
    M0 上下文装载 → M1 准入校验 → M2 岗位规划（1~5 个）
      → 对每个岗位：S1 → C1 →(S2 → C1b)→ N3 → C1.5
      → C3.5 复用候选召回 → M4 增量归并判定 → C4 装配 → C5 自检
    LLM 调用 ≈ 3 + 2×岗位数    检索 ≈ 1~2×岗位数

L2  新增岗位
    M0 → M1 → S1 → C1 →(S2 → C1b)→ N3 → C1.5
      → C3.5 → M4 → C4 → C5
    LLM 调用 = 3（M1 / N3 / M4）  检索 = 1~2 次

L3  新增能力项
    M0 → M1（查重是这条链路的主要价值）
      → 命中重复：直接返回 needs_input，不再往下跑
      → 未命中：S1 定向检索 1 次 → C1 → M3 单条建档 → C1.5
    LLM 调用 = 2（M1 / M3）      检索 = 1 次
```

**L3 的重点是拦截**。用户手填的能力项十有八九字典里已有，只是叫法不同。M1 命中重复时**立即返回**，不消耗检索与生成的调用——这条链路一半以上的请求应该终止在这里，这是设计预期，不是失败。

---

## 四、返回的数据结构

严格按页面现有的 tree schema 返回，前端拿到直接 `push` 进树即可，不做二次转换。

### 4.1 L1 返回（新增子行业）

```jsonc
{
  "node": {
    "name": "旅游装备与营地服务",
    "describe": "面向露营、户外营地的产品与运营服务",
    "info": { "priority": "core", "typicalEmployers": ["营地运营商","户外俱乐部","装备租赁商"] },
    "positions": [
      {
        "name": "营地运营专员", "aliases": ["营地管家"],
        "describe": "负责营地日常运营、客户接待与设施维护",
        "careerLevel": "初级/中级",
        "abilities": [ /* 结构见 4.3 */ ]
      }
    ]
  },
  "mergeReport": { /* 见 4.4 */ }
}
```

### 4.2 L2 返回（新增岗位）

```jsonc
{
  "node": {
    "name": "OTA产品运营专员", "aliases": ["OTA运营","平台运营专员"],
    "describe": "负责在线平台的商品结构、流量与转化运营",
    "careerLevel": "初级/中级",
    "abilities": [ /* 见 4.3 */ ]
  },
  "mergeReport": { /* 见 4.4 */ }
}
```

### 4.3 能力项对象（三条链路共用）

**已有字段照用，不改名**：

```jsonc
{
  "id": "n13",                      // 判定为复用已有能力时=原 id；新建时由服务端生成
  "name": "在线渠道商品信息维护",
  "type": "skill",                  // knowledge | skill | attitude
  "domain": "数字化系统与信息处理",   // 必须取自本图已有领域清单，见第五节
  "core": false,
  "weight": 0.25,
  "requiredLevel": "L2",
  "behaviorDesc": "独立完成平台商品信息的录入、校对与上下架",
  "observablePoints": ["30分钟内完成一个新商品的完整录入","核对价格与库存一致性","按平台规则填写标题与卖点"],
  "assessMethod": "系统实操考核",
  "l1Req": "…", "l1AssessMethod": "…",
  "l2Req": "…", "l2AssessMethod": "…",
  "l3Req": null, "l3AssessMethod": null,
  "inferred": false,
  "flag": null,
  "prerequisites": []
}
```

**需要新增的字段（4 个，都是最小必要）**：

| 字段 | 值 | 为什么必须有 | 不加会怎样 |
|---|---|---|---|
| `mergeDecision` | `reuse` / `new` / `child` | 告诉前端这条是复用已有的还是新建的 | 前端无法区分，会把复用的能力当新能力再建一份，同一条能力在图里出现多个 id |
| `reuseOf` | 被复用的能力 id，`new` 时为 null | 复用时要指回原节点 | 同上 |
| `evidences` | `[{sourceTitle, url, excerpt, sourceLevel}]` | **整套建图方案的立身之本是"无证据不入主干"** | 详见第五节，这是当前最大的缺口 |
| `createdBy` | 构建任务号 `bt_…` | 出问题时能定位"这条是哪次构建加的"、能整批撤回 | 只能人工逐条找，没法回滚 |

`aliases` 建议也加到能力项上（岗位已经有了）：归并判定靠它命中同义项，不加的话同一条能力换个叫法就判不出来，图谱会越长越碎。

### 4.4 mergeReport

```jsonc
{
  "total": 14, "reuse": 7, "new": 5, "child": 2,
  "reuseRate": 0.5,
  "newDomains": [],                 // 本次新开的领域，超过 1 个要提示
  "inferredRate": 0.14,
  "lowConfidence": [                // 需要人工确认的，前端按页面 PRD 的方式呈现
    { "name": "渠道价格策略执行", "decision": "new",
      "nearest": { "id": "n22", "name": "营销活动执行", "score": 0.61 },
      "reason": "两者都涉及活动执行，但新条目含定价权限判断" }
  ],
  "warnings": ["复用率 50%，正常区间"]
}
```

前端可以先只用 `total/reuse/new/child` 三个数做提示，`lowConfidence` 在差异确认那一版再接。

---

## 五、五个必须先定的口径

读代码时发现了五处不一致，都会直接影响服务端怎么返回，建议开工前一次性定掉。

### 5.1 能力项到底存在哪 ★ 最重要

现在的实现：新增岗位时勾选已有能力，代码是 `found = {...a}` —— **把能力对象整个复制一份塞进新岗位的 `abilities` 数组，id 相同**。也就是说，一条能力在树里以同 id 的多份副本存在。

这带来两个问题：

1. **改一条能力要改 N 份。** 复制出去的副本各自独立，改了其中一份，别的岗位下还是老的，同一个 id 的两份数据内容不一样。
2. **增量的核心校验做不了。** V2.2 的"存量语义不被改写"靠比对指纹实现，前提是一条能力有唯一一份可写副本。现在没有这个副本。

**建议：引入能力字典，树内降为只读投影。**

```
graph.abilityDictionary[]   // 唯一可写副本：name / type / domain / definition / 三级要求 / evidences / aliases
graph.tree…positions[].abilities[]  // 只存 { id, requiredLevel, weight }，渲染时 join 字典
```

改动量集中在 `renderGraph()` 和 `submitAddNode` 的能力项分支，一次性迁移脚本把现有树里的副本按 id 去重抽成字典即可。**这件事要在接服务之前做完**，否则服务端返回的归并结果没地方落。

如果这一版不想动结构，退而求其次：服务端仍返回完整能力对象、前端继续复制，但必须接受"同名能力多份副本会逐渐漂移"，并且**存量保护校验这一版做不了**。这个取舍要明确记录，不要默认。

### 5.2 能力项是单级还是三级

现在数据里是**单级快照**（`requiredLevel` + `behaviorDesc` + `observablePoints` + `assessMethod`），但新增表单采集的是**分级要求**（L1 必填、L2/L3 可选，`submitAddNode` 写进 `l1Req`/`l2Req`/`l3Req`）。两种形态在同一份数据里并存。

**建议**：字典里存完整三级（L1/L2/L3 各自的要求与考核方式），`requiredLevel` 指向本岗位需要达到的那一级，`behaviorDesc`/`assessMethod` 由程序从对应级摘副本、不让模型写第二遍。这也是 V2/V2.2 一直的做法，和表单能对上，只是把"L2/L3 可选"改成"AI 一次生成三级，用户可删"。

服务端按这个返回；如果决定维持单级，`l2Req`/`l3Req` 就固定返回 null，要提前说。

### 5.3 第三类能力的枚举值

页面表单是 `attitude`（素养），建图 prompt 里是 `literacy`。现有图谱数据里两个都没出现过（只有 knowledge 和 skill），所以现在改代价最小。

**建议统一为 `attitude`** —— 符合 KSA（Knowledge / Skill / Attitude）的通行写法，且页面已经写好了，只需改 prompt 一处。**不要在接口层做映射**，映射层是日后所有诡异 bug 的来源。

### 5.4 证据字段整个缺失

`ability-graph.js` 里 `evidence` 出现 **0 次**。也就是说，现在图谱上的每一条能力，页面都答不上"依据是什么"。

这和整套方案的第一原则冲突——"无证据不入主干，每条能力必须带来源 URL 与原文片段"。AI 构建会产出证据，但页面没有地方存、没有地方看。

**建议**：能力项加 `evidences` 数组和 `inferred` 标记（`inferred` 页面已经有了，只是没展示）。页面上最小实现是能力项详情里一行"依据：XX职业技能标准 ▸"，点开看原文片段。**没有这个，专业评估和教学诊改场合用不了这张图**，AI 建图的可信度优势也就没了。

### 5.5 observablePoints 没有采集入口

数据里有 `observablePoints`（已建的 g1 图谱每条能力都有 3~4 条），但新增能力项的表单里没有对应输入框。AI 构建会生成它，用户手动新增时就没有。

**建议**：表单补一个多行输入（一行一条），AI 构建时自动填好，用户可改。不补的话，手动加的能力项和 AI 建的在详情页显示会不一致。

---

## 六、异常与降级

| 情况 | 服务端返回 | 前端表现 |
|---|---|---|
| 命中查重（L3 为主） | `status: needs_input`, `reason: blocked`, 附最多 3 条候选 + 建议动作 | 提示已有同类能力，给「去看已有 / 加为别名 / 仍要另建」 |
| 超出本图边界 | `status: needs_input`, `reason: out_of_boundary`, 说明差异 | 提示并给出口，**不放行** |
| 检索不到足够资料 | `status: needs_input`, `reason: needs_material` | 给一个粘贴框收 JD / 内部标准原文，回传后继续构建 |
| 构建超时（> 15 分钟） | `status: failed`, `error.code: timeout` | 可重试，重试保留已填表单 |
| LLM 返回不合规 JSON | 服务端内部重试 2 次后 `failed` | 不暴露内部细节，提示"构建失败，请重试" |
| 同一图谱已有任务在跑 | `409`，附在跑任务的 `taskId` 与发起人 | 提示稍候，不排队 |
| 结果自检不通过 | 内部走定向修复回环 ≤2 轮，仍不过则降级返回并在 `mergeReport.warnings` 说明 | 正常展示，但标注"部分条目需人工复核" |

**关于资料不足**：不要降级硬造。宁可返回 `needs_material` 让用户贴一段 JD，也不要生成一堆无依据的能力项——用户贴的内容同样走逐字比对校验，不因为是人给的就放松。

---

## 七、验收

1. 用**已经在图里的岗位名**发起一次 L2 构建，返回的 `mergeReport.reuseRate` 应 ≥ 0.9、`new` ≤ 2。这是最好的回归测试：把已有的东西再建一遍，结果应该几乎全是复用。
2. L3 提交一条字典里已有的能力（比如已有「旅游资源归类与讲解」，提交「旅游资源讲解」），必须在 M1 就返回 `blocked`，且服务端日志显示**没有发生检索和生成调用**。
3. 任意一次构建返回的能力项，`domain` 100% 落在本图已有领域清单内，或在 `mergeReport.newDomains` 中显式申报（本次最多 1 个）。
4. 返回的每条能力项，要么 `evidences` 非空，要么 `inferred: true`，不允许两者都空。
5. 构建期间关闭页面再打开，凭 `taskId` 能查到任务仍在跑或已完成。
6. 同一个 `clientRequestId` 重复提交，返回同一个 `taskId`，不产生两个岗位。

---

## 附：读代码时发现的一个前端 bug

`aiBuildNewChildren()` 的 `type === 3` 分支（新增节点弹框里点 AI 构建能力项），填充的是 `#addChildL1Desc` / `#addChildL2Desc` / `#addChildBehaviorDesc` —— 这几个是**另一个弹框（添加子节点）的输入框 id**。新增节点弹框里对应的 id 是 `#newNodeL1` / `#newNodeL2` / `#newNodeBehavior`。

结果是：在「新增节点」弹框里选能力项、点 AI 自动构建，toast 会提示成功，但表单一个字都不会填上。接服务时顺手改掉。
