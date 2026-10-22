# 智能任务管理系统

基于 Node.js + Supabase 的任务管理应用，完美适配 Vercel 一键部署。

## 功能特性
- 任务添加：输入框 + 高/中/低优先级下拉选择
- 任务列表：显示标题、优先级标签、完成状态
- 状态切换：每条任务可切换完成/未完成
- 删除功能：单条任务删除
- 优先级筛选：全部/高/中/低
- 按创建时间倒序排列，已完成任务显示删除线
- 中文界面，简洁美观的卡片式设计

## 技术栈
- 后端：Node.js + @supabase/supabase-js（Vercel Serverless Functions）
- 数据库：Supabase (PostgreSQL)
- 前端：原生 HTML/CSS/JavaScript

## 目录结构
```
task-manager/
├── api/                     # Vercel Serverless 接口目录
│   ├── _utils.js            # 公共工具（Supabase客户端、body解析）
│   └── tasks/
│       ├── index.js         # GET/POST 任务接口
│       └── [id].js          # PATCH/DELETE 单任务接口
├── public/                  # 静态前端页面
│   └── index.html
├── package.json
├── vercel.json              # Vercel 配置
├── .env.example             # 环境变量示例
└── README.md
```

## 部署前准备

### 1. 创建 Supabase 数据表
在 Supabase SQL 编辑器中执行：
```sql
create table tasks (
  id bigint generated always as identity primary key,
  title text not null,
  priority text not null check (priority in ('高', '中', '低')),
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table tasks enable row level security;
create policy allow_all on tasks using (true) with check (true);
```

### 2. 获取 Supabase 密钥
进入 Supabase 项目 → 设置 → API，复制 `Project URL` 和 `anon public` 密钥。

## 部署到 Vercel
1. 将本项目推送到 GitHub 仓库
2. 打开 Vercel，导入对应 GitHub 仓库
3. 在 Environment Variables 中添加：
   - `SUPABASE_URL`：你的 Supabase 项目 URL
   - `SUPABASE_ANON_KEY`：你的 Supabase anon 密钥
4. 点击 Deploy，等待部署完成即可获得预览链接
