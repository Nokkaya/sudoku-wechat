// components/number-pad/number-pad.js
Component({
  properties: {
    // 是否有选中的格子
    hasSelection: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    // 点击数字
    onNumberTap(e) {
      const number = e.currentTarget.dataset.number
      this.triggerEvent('numberinput', { number })
      
      // 触觉反馈
      wx.vibrateShort({
        type: 'light'
      })
    },

    // 点击清除
    onClearTap() {
      this.triggerEvent('clear')
      
      // 触觉反馈
      wx.vibrateShort({
        type: 'medium'
      })
    }
  }
})
