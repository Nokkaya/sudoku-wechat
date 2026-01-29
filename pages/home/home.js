// pages/home/home.js
const app = getApp()

Page({
  data: {
    modes: [],
    selectedMode: 1, // 默认选择"简单"
    hasSavedGame: false,
    stats: {
      totalGames: 0,
      bestTime: '--:--'
    }
  },

  onLoad() {
    // 加载难度配置
    this.setData({
      modes: app.globalData.modes
    })
    
    // 检查是否有保存的游戏
    this.checkSavedGame()
    
    // 加载统计数据
    this.loadStats()
  },

  onShow() {
    // 每次显示页面时检查保存的游戏
    this.checkSavedGame()
  },

  // 检查是否有保存的游戏
  checkSavedGame() {
    const savedGame = wx.getStorageSync('sudoku_current_game')
    this.setData({
      hasSavedGame: !!savedGame
    })
  },

  // 加载统计数据
  loadStats() {
    const stats = wx.getStorageSync('sudoku_stats') || {
      totalGames: 0,
      bestTime: '--:--',
      completedGames: []
    }
    this.setData({ stats })
  },

  // 选择难度
  selectMode(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedMode: index
    })
    
    // 触觉反馈
    wx.vibrateShort({
      type: 'light'
    })
  },

  // 开始新游戏
  startNewGame() {
    const mode = this.data.modes[this.data.selectedMode]
    
    // 如果有保存的游戏，提示是否覆盖
    if (this.data.hasSavedGame) {
      wx.showModal({
        title: '开始新游戏',
        content: '当前有未完成的游戏，开始新游戏将会覆盖进度，是否继续?',
        confirmText: '继续',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.navigateToGame(mode)
          }
        }
      })
    } else {
      this.navigateToGame(mode)
    }
  },

  // 继续游戏
  continueGame() {
    wx.navigateTo({
      url: '/pages/game/game?continue=true'
    })
  },

  // 跳转到游戏页面
  navigateToGame(mode) {
    wx.navigateTo({
      url: `/pages/game/game?difficulty=${mode.holes}&modeName=${mode.name}&modeId=${mode.id}`
    })
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '一起来玩数独游戏吧！',
      path: '/pages/home/home',
      imageUrl: '' // 可以添加分享图片
    }
  }
})
