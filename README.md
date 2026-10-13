# 专业图谱平台

面向职业能力与知识内容的**图谱管理前端原型**（旅游业 / 职教场景）。围绕「能力图谱」与「知识体系」两套结构，提供图谱浏览、节点增删、知识库维护，以及两者之间**映射关系的审核**能力。

> 当前为**纯静态前端原型**：数据为页面内硬编码 / 前端模拟，尚未接入真实后端。AI 自动构建、映射置信度等均为占位实现。

## 模块与页面

顶部导航含五个模块，对应入口页面如下：

| 模块 | 入口页面 | 子页面 |
|---|---|---|
| 知识图谱 | `knowledge-graph.html` | `knowledge-graph-view.html`（全景图谱） |
| 知识体系 | `knowledge-system.html` | `knowledge-system-detail.html`（知识体系详情） |
| 知识库 | `knowledge-base.html` | `knowledge-base-create.html`（创建）、`knowledge-base-detail.html`（详情） |
| 能力图谱 | `ability-graph.html` | `ability-graph-tree.html`（能力图谱详情，树形） |
| 图谱映射审核台 | `mapping-review.html` | — |

- **能力图谱**：按「行业 → 子行业 → 岗位 → 能力项」层级组织，能力项含类型、领域、各等级要求、考核方式与前置能力项。
- **知识体系**：专业知识结构（如景区开发与管理、酒店管理、旅游管理等专业知识体系）。
- **知识图谱 / 全景图谱**：图谱全景浏览、行业视角卡片、查看与筛选映射任务。
- **图谱映射审核台**：审核「能力图谱节点 ↔ 知识体系节点」的候选映射，含置信度、锚定依据、一键通过等能力。
- **知识库**：知识库列表、创建与详情。

## 技术栈

- 纯 **HTML / CSS / JavaScript**，无构建工具、无依赖、无 `package.json`。
- 入口直接打开对应 `.html` 即可；如需本地静态服务可运行：

  ```bash
  python3 -m http.server 8000
  ```

## 目录结构

```
.
├── *.html                 # 各模块页面（见上表）
├── mapping-*.css          # 通用 / 审核台 / 任务 / 分页等样式
├── mapping-review.js      # 映射审核台逻辑
├── ability-graph.css      # 能力图谱样式
├── ability-graph.js       # 能力图谱逻辑（含 AI 自动构建前端模拟）
├── Claude outputs/        # 需求文档：
│   ├── 新增节点-AI自动构建-AI产品方案.md
│   └── 新增节点-AI自动构建-服务方案.md
└── mapping-review-package.zip   # 打包件
```

## 需求文档

- `Claude outputs/新增节点-AI自动构建-AI产品方案.md`：定义「⚡ AI 自动构建」按钮的产品行为与成功标准。
- `Claude outputs/新增节点-AI自动构建-服务方案.md`：对应服务端实现方案（对接 `ability-graph.js` 的 `aiBuildNewChildren()` / `aiBuildAddChildren()` / `generateAIChildren()`，目前为 `setTimeout` + 硬编码模板的前端模拟）。
