# SmartDo 智能待办

这是一个基于 AI 的智能待办事项管理应用，可以自动将复杂任务拆解为子任务。

## 功能特性

- ✅ 添加、编辑、删除待办事项
- 🖼️ 支持图片附件
- 🤖 AI 自动拆解任务为子任务
- 📱 响应式设计
- 💾 本地存储
- 🖥️ 支持打包为桌面应用（Windows/macOS/Linux）

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Electron（桌面应用）
- Google Gemini AI

## 开发

```bash
# 安装依赖
npm install

# 启动 Web 版本
npm run dev

# 启动 Electron 桌面版
npm run electron:dev

# 打包 Web 版本
npm run build

# 打包 Electron 桌面版
npm run electron:build
```

## 打包说明

本项目已配置 GitHub Actions 自动打包：
- 推送代码到 main 分支会触发构建
- 创建 tag（如 v1.0.0）会自动发布 Release

## 手动打包

Windows 系统：
```bash
npm run electron:build
```

打包文件将生成在 `dist-electron` 目录。

## 发布流程

1. 更新 `package.json` 中的版本号
2. 创建 Git tag：
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. GitHub Actions 会自动构建并发布到 Release

## 许可证

MIT
