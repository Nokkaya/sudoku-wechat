// app.js
App({
  onLaunch() {
    // 初始化小程序
    console.log('数独小程序启动')
    
    // 检查是否有保存的游戏进度
    const savedGame = wx.getStorageSync('sudoku_current_game')
    if (savedGame) {
      this.globalData.hasSavedGame = true
      this.globalData.savedGame = savedGame
    }
  },
  
  globalData: {
    hasSavedGame: false,
    savedGame: null,
    // 难度配置
    modes: [
      { id: 'easy-plus', name: '简单+', holes: 25, dots: 1 },
      { id: 'easy', name: '简单', holes: 35, dots: 2 },
      { id: 'medium', name: '中等', holes: 45, dots: 3 },
      { id: 'hard', name: '困难', holes: 55, dots: 4 },
      { id: 'hard-plus', name: '困难+', holes: 65, dots: 5 }
    ]
  }
})
