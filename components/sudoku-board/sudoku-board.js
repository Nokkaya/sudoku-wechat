// components/sudoku-board/sudoku-board.js
Component({
  properties: {
    // 棋盘数据
    board: {
      type: Array,
      value: []
    },
    // 原始棋盘（用于判断是否是预填充）
    originalBoard: {
      type: Array,
      value: []
    },
    // 当前选中的格子
    selectedCell: {
      type: Object,
      value: null
    }
  },

  methods: {
    // 获取单元格的样式类名
    getCellClass(row, col, value) {
      const classes = []
      
      // 检查是否是原始数字（预填充）
      if (this.data.originalBoard[row] && 
          this.data.originalBoard[row][col] !== 0) {
        classes.push('original')
      } else if (value !== 0) {
        // 用户填入的数字
        classes.push('filled')
      }
      
      // 检查是否被选中
      if (this.data.selectedCell && 
          this.data.selectedCell.row === row && 
          this.data.selectedCell.col === col) {
        classes.push('selected')
      }
      
      // 高亮同行、同列、同宫格
      if (this.data.selectedCell) {
        const sr = this.data.selectedCell.row
        const sc = this.data.selectedCell.col
        
        if (row === sr || col === sc || 
            (Math.floor(row / 3) === Math.floor(sr / 3) && 
             Math.floor(col / 3) === Math.floor(sc / 3))) {
          if (!(row === sr && col === sc)) {
            classes.push('highlight')
          }
        }
      }
      
      // 3x3 宫格边框
      if (col % 3 === 2 && col !== 8) classes.push('right-thick')
      if (row % 3 === 2 && row !== 8) classes.push('bottom-thick')
      
      return classes.join(' ')
    },

    // 点击单元格
    onCellTap(e) {
      const { row, col } = e.currentTarget.dataset
      
      // 只能选择空格或用户填入的格子（不能选择预填充格子）
      if (this.data.originalBoard[row][col] === 0) {
        this.triggerEvent('cellselect', { row, col })
        
        // 触觉反馈
        wx.vibrateShort({
          type: 'light'
        })
      }
    }
  }
})
