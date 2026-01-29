// 数独核心算法 - 小程序版本
class Sudoku {
  constructor() {
    this.board = []
    this.solution = []
    this.difficulty = 40
  }

  // 生成完整的数独盘面
  generateComplete() {
    this.board = Array(9).fill(null).map(() => Array(9).fill(0))
    this.solve(0, 0)
    this.solution = this.board.map(row => [...row])
    return this.board
  }

  // 挖空生成题目
  createPuzzle(difficulty = 40) {
    this.generateComplete()
    let attempts = difficulty
    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      if (this.board[row][col] !== 0) {
        this.board[row][col] = 0
        attempts--
      }
    }
    return this.board
  }

  // 数独求解器
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

  // 检查数字是否有效
  isValid(row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (this.board[row][x] === num) return false
    }
    for (let x = 0; x < 9; x++) {
      if (this.board[x][col] === num) return false
    }
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[startRow + i][startCol + j] === num) return false
      }
    }
    return true
  }

  // 洗牌算法
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  // 检查盘面是否完成且正确
  checkWin(userBoard) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (userBoard[row][col] !== this.solution[row][col]) {
          return false
        }
      }
    }
    return true
  }

  // 获取提示
  getHint(userBoard) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (userBoard[row][col] === 0 || userBoard[row][col] !== this.solution[row][col]) {
          return { row, col, value: this.solution[row][col] }
        }
      }
    }
    return null
  }
}

// 导出单例
module.exports = new Sudoku()
