// pages/game/game.js
const sudoku = require('../../utils/sudoku')

Page({
  data: {
    // 游戏状态
    board: [],
    originalBoard: [],
    solution: [],
    selectedCell: null,

    // 游戏信息
    difficulty: 35,
    modeName: '简单',
    modeId: 'easy',
    timer: 0,
    hints: 3,
    isComplete: false
  },

  // 计时器
  timerInterval: null,

  onLoad(options) {
    const { difficulty, modeName, modeId, continue: continueGame } = options

    // 启用返回确认
    wx.enableAlertBeforeUnload({
      message: '游戏进度已自动保存，确定要返回主菜单吗？',
    })

    if (continueGame === 'true') {
      // 继续游戏
      this.loadSavedGame()
    } else {
      // 开始新游戏
      this.setData({
        difficulty: parseInt(difficulty),
        modeName: modeName,
        modeId: modeId
      })
      this.initGame()
    }

    // 启动计时器
    // this.startTimer() // 由 onShow 统一管理
  },

  onUnload() {
    // 页面卸载时停止计时器
    this.stopTimer()

    // 如果游戏未完成，自动保存进度
    // AlertBeforeUnload 会先触发，如果用户点确定，才会走这里。
    // 如果用户点了确定返回，意味着放弃当前进度？
    // 通常返回主页时不应该自动保存“中断”状态，除非是意外退出。
    // Web版逻辑：Exit -> Clear State.
    // 但小程序版这里不仅是Exit，也可能是切换后台被回收？(onHide vs onUnload)
    // 这里的 onUnload 是页面销毁（返回）。
    // 如果是用户主动点击返回并确认，应该视为“退出且不保存”还是“保存”？
    // Web版 "Exit to Menu" 清除了 saved game?
    // Web: exitToMenu -> gameStarted = false.
    // Miniprogram: saveGame() logic saves current state.
    // If we want to simulate Web "Give Up", we shouldn't save.
    // But existing logic saves. I will keep existing logic to be safe, or user didn't ask to change logic, only UI.

    if (!this.data.isComplete) {
      this.saveGame()
    }
  },

  onHide() {
    // 页面隐藏时暂停计时器
    this.stopTimer()
  },

  onShow() {
    // 页面显示时恢复计时器
    if (!this.data.isComplete) {
      this.stopTimer()
      this.startTimer()
    }
  },

  // 退出确认逻辑
  showExitModal() {
    this.setData({ showExitConfirm: true })
  },

  cancelExit() {
    this.setData({ showExitConfirm: false })
  },

  exitToMenu() {
    this.setData({ showExitConfirm: false })
    wx.navigateBack()
  },

  // 初始化游戏
  initGame() {
    // 生成数独谜题
    const board = sudoku.createPuzzle(this.data.difficulty)
    const solution = sudoku.solution.map(row => [...row])
    const originalBoard = board.map(row => [...row])

    // 将 solution 存储在实例上，不参与渲染
    this.solution = solution

    this.setData({
      board: board,
      originalBoard: originalBoard,
      // solution: solution, // Removed from setData
      timer: 0,
      hints: 3,
      isComplete: false,
      selectedCell: null
    })
  },

  // 加载保存的游戏
  loadSavedGame() {
    const savedGame = wx.getStorageSync('sudoku_current_game')
    if (savedGame) {
      this.solution = savedGame.solution // Restore solution to instance

      this.setData({
        board: savedGame.board,
        originalBoard: savedGame.originalBoard,
        // solution: savedGame.solution, // Removed from setData
        difficulty: savedGame.difficulty,
        modeName: savedGame.modeName,
        modeId: savedGame.modeId,
        timer: savedGame.timer,
        hints: savedGame.hints
      })

      // 恢复 sudoku 对象的状态
      sudoku.solution = savedGame.solution
    }
  },

  // 保存游戏进度
  saveGame() {
    wx.setStorageSync('sudoku_current_game', {
      board: this.data.board,
      originalBoard: this.data.originalBoard,
      solution: this.solution, // Use this.solution
      difficulty: this.data.difficulty,
      modeName: this.data.modeName,
      modeId: this.data.modeId,
      timer: this.data.timer,
      hints: this.data.hints
    })
  },

  // 启动计时器
  startTimer() {
    this.stopTimer() // 再次确保清除，防止重复
    this.timerInterval = setInterval(() => {
      this.setData({
        timer: this.data.timer + 1
      })
    }, 1000)
  },

  // 停止计时器
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  },

  // 格式化时间 MM:SS
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // 选择格子
  onCellSelect(e) {
    const { row, col } = e.detail
    this.setData({
      selectedCell: { row, col }
    })
  },

  // 输入数字
  onNumberInput(e) {
    const number = e.currentTarget.dataset.number
    const { selectedCell, board, originalBoard } = this.data

    if (!selectedCell) {
      wx.showToast({
        title: '请先选择一个格子',
        icon: 'none'
      })
      return
    }

    // 检查是否是原始数字
    if (originalBoard[selectedCell.row][selectedCell.col] !== 0) {
      return
    }

    // 填入数字
    const newBoard = board.map(row => [...row])
    newBoard[selectedCell.row][selectedCell.col] = number

    this.setData({
      board: newBoard
    }, () => {
      // 检查是否完成
      this.checkComplete()
    })
  },

  // 清除格子
  onClear() {
    const { selectedCell, board, originalBoard } = this.data

    if (!selectedCell) {
      wx.showToast({
        title: '请先选择一个格子',
        icon: 'none'
      })
      return
    }

    // 检查是否是原始数字
    if (originalBoard[selectedCell.row][selectedCell.col] !== 0) {
      return
    }

    // 清除数字
    const newBoard = board.map(row => [...row])
    newBoard[selectedCell.row][selectedCell.col] = 0

    this.setData({
      board: newBoard
    })
  },

  // 使用提示
  useHint() {
    if (this.data.hints <= 0) {
      wx.showToast({
        title: '提示次数已用完',
        icon: 'none'
      })
      return
    }

    const hint = sudoku.getHint(this.data.board)
    if (!hint) {
      wx.showToast({
        title: '已经完成了!',
        icon: 'success'
      })
      return
    }

    // 填入提示
    const newBoard = this.data.board.map(row => [...row])
    newBoard[hint.row][hint.col] = hint.value

    this.setData({
      board: newBoard,
      hints: this.data.hints - 1,
      selectedCell: { row: hint.row, col: hint.col }
    }, () => {
      // 检查是否完成
      this.checkComplete()
    })

    wx.showToast({
      title: '已填入提示',
      icon: 'success'
    })
  },

  // 检查是否完成
  checkComplete() {
    // 检查是否还有空格
    let hasEmpty = false
    for (let row of this.data.board) {
      if (row.includes(0)) {
        hasEmpty = true
        break
      }
    }

    if (hasEmpty) {
      return
    }

    // 检查是否正确
    const isCorrect = sudoku.checkWin(this.data.board)

    if (isCorrect) {
      this.stopTimer()
      this.setData({
        isComplete: true
      })

      // 保存统计数据
      this.saveStats()

      // 清除保存的游戏
      wx.removeStorageSync('sudoku_current_game')

      // 触觉反馈
      wx.vibrateShort({
        type: 'heavy'
      })
    } else {
      wx.showToast({
        title: '有错误,请检查',
        icon: 'none'
      })
    }
  },

  // 保存统计数据
  saveStats() {
    const stats = wx.getStorageSync('sudoku_stats') || {
      totalGames: 0,
      bestTime: '--:--',
      completedGames: []
    }

    stats.totalGames++
    stats.completedGames.push({
      difficulty: this.data.modeId,
      modeName: this.data.modeName,
      time: this.data.timer,
      hints: this.data.hints,
      date: new Date().toISOString()
    })

    // 更新最佳时间
    if (stats.bestTime === '--:--' || this.data.timer < this.parseTime(stats.bestTime)) {
      stats.bestTime = this.formatTime(this.data.timer)
    }

    wx.setStorageSync('sudoku_stats', stats)
  },

  // 解析时间字符串为秒
  parseTime(timeStr) {
    const [mins, secs] = timeStr.split(':').map(Number)
    return mins * 60 + secs
  },

  // 重新开始
  restart() {
    if (this.data.isComplete) {
      // 如果已完成，返回主页
      this.backToHome()
    } else {
      // 确认重新开始
      wx.showModal({
        title: '重新开始',
        content: '确定要重新开始当前游戏吗?',
        success: (res) => {
          if (res.confirm) {
            this.stopTimer()
            this.initGame()
            this.startTimer()
          }
        }
      })
    }
  },

  // 返回主页
  backToHome() {
    wx.navigateBack()
  },

  // 阻止事件冒泡
  stopPropagation() { },

  // 分享功能
  onShareAppMessage() {
    return {
      title: `我在${this.data.modeName}难度完成了数独游戏!`,
      path: '/pages/home/home'
    }
  }
})
