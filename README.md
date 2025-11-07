# 📚 图书预约小程序

基于 Taro + React + NutUI 构建的图书预约小程序，提供便捷的图书检索、分类浏览和在线预约功能。

## ✨ 功能特性

- 🔍 **智能搜索** - 支持书名、作者、描述关键词模糊搜索
- 📂 **分类浏览** - 技术、设计、文学三大分类，实时显示可预约册数
- 📱 **响应式设计** - 适配多端小程序平台
- 🎯 **用户体验** - 防抖搜索、表单验证、友好提示
- 🔒 **类型安全** - 完整的 TypeScript 类型定义
- 📊 **状态管理** - Redux Toolkit 状态管理

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- pnpm >= 7.0.0
- Taro CLI >= 4.1.7

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install

# 或使用 npm
npm install
```

### 开发模式

```bash
# 微信小程序开发
pnpm run dev:weapp

# H5 开发
pnpm run dev:h5

# 支付宝小程序开发
pnpm run dev:alipay

# 字节跳动小程序开发
pnpm run dev:tt
```

### 构建生产版本

```bash
# 微信小程序构建
pnpm run build:weapp

# H5 构建
pnpm run build:h5

# 其他平台构建
pnpm run build:alipay    # 支付宝
pnpm run build:tt        # 字节跳动
pnpm run build:swan      # 百度
pnpm run build:qq        # QQ
pnpm run build:jd        # 京东
```

## 📁 项目结构

```
src/
├── apis/           # API 接口
├── components/     # 公共组件
├── pages/          # 页面组件
│   ├── index/      # 首页
│   ├── book/       # 图书预约页
│   ├── me/         # 个人中心
│   └── login/      # 登录页面
├── services/       # 服务层
├── store/          # 状态管理
├── types/          # 类型定义
├── utils/          # 工具函数
├── app.ts          # 应用入口
└── app.config.ts   # 应用配置
```

## 🎯 核心功能

### 图书检索
- 支持书名、作者、描述多字段搜索
- 300ms 防抖优化，提升搜索性能
- 实时显示匹配结果数量

### 分类浏览
- **技术前沿** - 编程、数据、AI相关图书
- **设计创意** - 产品、视觉、体验设计图书
- **文学人文** - 小说、随笔、传记类图书

### 预约流程
1. 选择图书 → 2. 填写信息 → 3. 提交预约 → 4. 等待确认

### 表单验证
- 手机号格式验证（11位数字）
- 日期格式验证（MM月DD日 HH:MM）
- 必填字段验证
- 实时错误提示

## 🔧 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Taro | 4.1.7 | 多端开发框架 |
| React | 18.0.0 | UI 框架 |
| TypeScript | 5.1.0 | 类型系统 |
| NutUI | 2.6.14 | UI 组件库 |
| Redux Toolkit | 2.10.1 | 状态管理 |
| Less | - | CSS 预处理器 |

## 📱 页面路由

```typescript
// app.config.ts
export default defineAppConfig({
  pages: [
    'pages/index/index',     // 首页
    'pages/book/index',      // 图书预约
    'pages/me/index',        // 个人中心
    'pages/login/index',     // 登录
    'pages/register/index'   // 注册
  ],
  tabBar: {
    list: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/book/index', text: '书架' },
      { pagePath: 'pages/me/index', text: '我的' }
    ]
  }
})
```

## 🎨 UI 组件

项目使用 NutUI React 组件库，主要组件包括：

- `SearchBar` - 搜索栏
- `Tabs` - 标签页
- `Button` - 按钮
- `Input` - 输入框
- `TextArea` - 文本域
- `Cell/CellGroup` - 单元格
- `Tag` - 标签

## 🔒 类型定义

项目提供完整的 TypeScript 类型定义：

```typescript
// types/book.ts
export interface BookInfo {
  id: string
  title: string
  author: string
  category: BookCategory
  slots: number
  desc: string
}

export type BookCategory = 'tech' | 'design' | 'literature'

export interface ReserveForm {
  name: string
  phone: string
  pickupDate: string
  comment: string
}
```

## 📊 状态管理

使用 Redux Toolkit 进行状态管理：

```typescript
// store/hooks.ts
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

## 🚨 错误处理

- 网络错误处理
- 业务错误分类
- 用户友好提示
- 错误日志记录

## 📈 性能优化

- **防抖搜索** - 300ms 延迟减少不必要的搜索
- **Memo 优化** - 使用 useMemo 缓存计算结果
- **懒加载** - 图片和组件按需加载
- **代码分割** - 路由级别的代码分割

## 🔍 开发工具

### 代码规范
- ESLint - 代码质量检查
- Prettier - 代码格式化
- TypeScript - 类型检查

### 调试工具
- Taro DevTools - 小程序调试
- React DevTools - React 组件调试
- Redux DevTools - 状态管理调试

## 📦 构建部署

### 微信小程序
1. 修改 `project.config.json` 中的 appid
2. 运行 `pnpm run build:weapp`
3. 使用微信开发者工具打开 `dist` 目录
4. 上传审核发布

### H5 部署
1. 运行 `pnpm run build:h5`
2. 将 `dist` 目录部署到 Web 服务器
3. 配置路由和缓存策略

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

- [Taro](https://taro.jd.com/) - 多端开发框架
- [NutUI](https://nutui.jd.com/) - 移动端组件库
- [React](https://reactjs.org/) - 用户界面库
- [Redux Toolkit](https://redux-toolkit.js.org/) - 状态管理工具

---

如有问题或建议，请提交 [Issue](https://github.com/your-repo/issues) 或联系开发团队。