# 数独游戏 - 微信小程序版

基于原 Web 版本完美复刻的微信小程序数独游戏。

## 📱 项目简介

这是一个功能完整、界面精美的数独游戏小程序，从 Vue 3 Web 应用完美迁移而来。保留了原版的所有核心功能和优秀的 UI 设计，并针对微信小程序平台进行了优化。

## ✨ 主要功能

### 🎮 游戏功能
- **5 个难度等级**
  - 简单+ (25 个空格)
  - 简单 (35 个空格)
  - 中等 (45 个空格)
  - 困难 (55 个空格)
  - 困难+ (65 个空格)

- **完整游戏体验**
  - ⏱ 实时计时器
  - 💡 3 次提示机会
  - ✅ 自动验证答案
  - 🎉 通关庆祝动画
  - 💾 自动保存进度

- **智能交互**
  - 高亮同行/同列/同宫格
  - 区分预填充和用户输入
  - 触觉反馈（震动）
  - 流畅的动画效果

### 📊 数据统计
- 完成游戏次数统计
- 最佳用时记录
- 游戏历史记录

### 💾 本地存储
- 自动保存游戏进度
- 支持继续未完成的游戏
- 统计数据持久化

## 📦 项目结构

```
miniprogram/
├── app.js                      # 小程序入口
├── app.json                    # 全局配置
├── app.wxss                    # 全局样式
├── sitemap.json               # 索引配置
├── project.config.json        # 项目配置
├── pages/                     # 页面目录
│   ├── home/                  # 首页（难度选择）
│   │   ├── home.wxml         # 页面结构
│   │   ├── home.wxss         # 页面样式
│   │   ├── home.js           # 页面逻辑
│   │   └── home.json         # 页面配置
│   └── game/                  # 游戏页
│       ├── game.wxml         # 页面结构
│       ├── game.wxss         # 页面样式
│       ├── game.js           # 页面逻辑
│       └── game.json         # 页面配置
├── components/                # 组件目录
│   ├── sudoku-board/         # 数独棋盘组件
│   │   ├── sudoku-board.wxml
│   │   ├── sudoku-board.wxss
│   │   ├── sudoku-board.js
│   │   └── sudoku-board.json
│   └── number-pad/           # 数字键盘组件
│       ├── number-pad.wxml
│       ├── number-pad.wxss
│       ├── number-pad.js
│       └── number-pad.json
└── utils/                     # 工具类
    └── sudoku.js             # 数独算法（100% 复用原版）
```

## 🚀 快速开始

### 1. 环境准备

- 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 注册微信小程序账号（可选，使用测试号也可以）

### 2. 导入项目

1. 打开微信开发者工具
2. 选择「导入项目」
3. 选择项目目录：`sudoku-web/miniprogram/`
4. 填写 AppID（可以使用测试号）
5. 点击「导入」

### 3. 运行项目

- 点击「编译」按钮即可在模拟器中预览
- 点击「预览」按钮可在真机上测试
- 点击「上传」按钮可提交审核

## 🎨 设计特色

### 配色方案
- **主色调**: 深灰黑 (#2d3436) + 米白色 (#faf9f7)
- **强调色**: 青绿色 (#00b894) - 成功/选中/提示
- **警告色**: 红色 (#ff6b6b) - 清除/错误

### 视觉效果
- 极简主义设计风格
- 温暖舒适的配色
- 圆角设计 (24rpx)
- 柔和阴影效果
- 流畅的过渡动画 (0.2s)

### 交互体验
- 触觉反馈（震动）
- 按钮点击动画 (scale 0.95)
- 格子选中高亮
- 同行列宫格提示
- 自定义弹窗

## 🔧 技术栈

- **框架**: 微信小程序原生开发
- **语言**: JavaScript (ES6+)
- **样式**: WXSS (类 CSS)
- **算法**: 回溯算法 (Backtracking)

## 🌟 核心算法

### 数独生成算法
```javascript
// 使用回溯算法生成完整数独盘面
generateComplete() {
  this.board = Array(9).fill(null).map(() => Array(9).fill(0))
  this.solve(0, 0)
  this.solution = this.board.map(row => [...row])
  return this.board
}
```

### 数独求解器
```javascript
// 深度优先搜索 + 回溯
solve(row, col) {
  if (row === 9) return true
  const nextRow = col === 8 ? row + 1 : row
  const nextCol = col === 8 ? 0 : col + 1
  
  const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  
  for (const num of numbers) {
    if (this.isValid(row, col, num)) {
      this.board[row][col] = num
      if (this.solve(nextRow, nextCol)) return true
      this.board[row][col] = 0
    }
  }
  return false
}
```

### 验证规则
- 行内无重复
- 列内无重复
- 3x3 宫格内无重复

## 📱 页面说明

### 首页 (pages/home)
- 难度选择列表
- 显示每个难度的空格数量
- 难度指示器（小圆点）
- 检测并提示未完成的游戏
- 显示游戏统计数据

### 游戏页 (pages/game)
- 顶部信息栏（难度/计时器/提示次数）
- 9x9 数独棋盘
- 数字键盘 (1-9)
- 清除按钮
- 提示按钮
- 重来按钮
- 返回按钮
- 退出确认弹窗
- 通关庆祝弹窗

## 🎯 主要功能实现

### 游戏进度保存
```javascript
// 保存到本地存储
wx.setStorageSync('sudoku_current_game', {
  board,
  originalBoard,
  solution,
  timer,
  hints,
  difficulty,
  modeName
})

// 读取保存的游戏
const savedGame = wx.getStorageSync('sudoku_current_game')
```

### 计时器管理
```javascript
// 启动计时器
startTimer() {
  this.timerInterval = setInterval(() => {
    this.setData({ timer: this.data.timer + 1 })
  }, 1000)
}

// 页面隐藏时暂停
onHide() {
  this.stopTimer()
}

// 页面显示时恢复
onShow() {
  if (!this.data.isComplete) {
    this.startTimer()
  }
}
```

### 格子高亮逻辑
```javascript
// 高亮同行、同列、同宫格
if (this.data.selectedCell) {
  const sr = this.data.selectedCell.row
  const sc = this.data.selectedCell.col
  
  if (row === sr || col === sc || 
      (Math.floor(row / 3) === Math.floor(sr / 3) && 
       Math.floor(col / 3) === Math.floor(sc / 3))) {
    classes.push('highlight')
  }
}
```

## 🆚 与原版 Web 对比

| 特性 | Web 版 | 小程序版 | 说明 |
|------|--------|----------|------|
| 框架 | Vue 3 | 原生小程序 | 完全重构，逻辑保持一致 |
| 核心算法 | sudoku.js | sudoku.js | **100% 复用，无修改** |
| 样式 | CSS | WXSS | 使用 rpx 单位，适配不同屏幕 |
| 路由 | 组件切换 | 页面跳转 | wx.navigateTo / wx.navigateBack |
| 存储 | 无 | wx.storage | ✅ 新增游戏进度保存 |
| 计时器 | setInterval | setInterval | ✅ 新增页面切换暂停/恢复 |
| 触觉反馈 | 无 | wx.vibrateShort | ✅ 新增震动反馈 |
| 分享 | 无 | onShareAppMessage | ✅ 新增微信分享 |

## 📈 迁移工作总结

### ✅ 已完成
1. ✅ 项目基础结构搭建
2. ✅ 核心算法迁移（100% 复用）
3. ✅ 首页难度选择界面
4. ✅ 游戏页面和棋盘组件
5. ✅ 数字键盘组件
6. ✅ 游戏逻辑（计时器、提示、验证）
7. ✅ 本地存储（进度保存、统计）
8. ✅ 弹窗组件（退出确认、通关庆祝）
9. ✅ 交互优化（触觉反馈、动画）
10. ✅ 样式适配（WXSS、rpx）

### 🎉 新增特性
- ✨ 游戏进度自动保存
- ✨ 支持继续未完成的游戏
- ✨ 游戏统计和历史记录
- ✨ 触觉反馈（震动）
- ✨ 微信分享功能
- ✨ 页面切换时暂停/恢复计时器

## 🎮 使用说明

### 开始游戏
1. 打开小程序
2. 选择难度（点击难度卡片）
3. 点击「开始游戏」按钮

### 游戏操作
1. **选择格子**: 点击空格
2. **输入数字**: 点击数字键盘 (1-9)
3. **清除数字**: 点击清除按钮（⌫）
4. **使用提示**: 点击「提示」按钮（剩余 3 次）
5. **重新开始**: 点击「重来」按钮
6. **返回主页**: 点击左上角返回按钮

### 游戏规则
- 每行不能有重复数字
- 每列不能有重复数字
- 每个 3x3 宫格不能有重复数字
- 填满所有格子且规则正确即通关

## 🐛 调试技巧

### 常见问题

**1. 组件不显示**
- 检查 `*.json` 文件中的 `usingComponents` 配置
- 确认组件路径是否正确（绝对路径，以 `/` 开头）

**2. 样式不生效**
- 检查是否使用了 `rpx` 单位（而不是 `px`）
- 确认 class 名称是否正确
- 查看是否有样式优先级问题

**3. 数据不更新**
- 确保使用了 `this.setData()` 更新数据
- 检查是否正确深拷贝了数组/对象

**4. 页面跳转失败**
- 检查 `app.json` 中是否注册了页面
- 确认页面路径是否正确

### 调试工具
- 使用 `console.log()` 输出日志
- 在微信开发者工具中查看 Console 面板
- 使用 Storage 面板查看本地存储
- 使用 Network 面板查看网络请求（如有）

## 📝 开发建议

### 性能优化
- ✅ 使用 `lazyCodeLoading` 按需注入代码
- ✅ 合理使用 `setData`，避免频繁更新
- ✅ 图片使用 WebP 格式（如需要）
- ✅ 避免在 `onShow` 中执行耗时操作

### 代码规范
- ✅ 使用 ES6+ 语法
- ✅ 保持代码简洁清晰
- ✅ 添加必要的注释
- ✅ 统一命名规范

### 用户体验
- ✅ 加载提示（如需要）
- ✅ 错误提示友好
- ✅ 触觉反馈适度
- ✅ 动画流畅自然

## 🔮 后续优化建议

### 功能增强
- [ ] 每日挑战模式
- [ ] 排行榜系统
- [ ] 多种主题切换
- [ ] 音效开关
- [ ] 撤销/重做功能
- [ ] 自动填入候选数字
- [ ] 错误检测提示

### 社交功能
- [ ] 好友对战
- [ ] 成就系统
- [ ] 分享战绩海报
- [ ] 邀请好友奖励

### 技术优化
- [ ] 使用云开发（云存储、云函数）
- [ ] 实现在线排行榜
- [ ] 添加埋点统计
- [ ] 性能监控

## 📄 许可证

本项目基于原 Web 版本开发，遵循相同的许可协议。

## 🙏 致谢

感谢原 Web 版本的优秀设计和实现，为小程序版本的开发提供了坚实的基础。

---

**Happy Coding! 🎉**

如有问题或建议，欢迎提 Issue 或 PR！
