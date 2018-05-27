// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key1: 1,
    key2: 0.5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  bindkey1: function (e) {
    var key1 = this.data.key1;
    var key2 = this.data.key2;
    key1=1;
    key2=0.5;
    this.setData({
      key1: key1,
      key2: key2
    })
  },

  bindkey2: function (e) {
    var key1 = this.data.key1;
    var key2 = this.data.key2;
    key2 = 1;
    key1 = 0.5;
    this.setData({
      key1: key1,
      key2: key2
    })
  },

  sumbit: function (e) {
    var key1 = this.data.key1;
    var key2 = this.data.key2;
    var language = 'chs';
    if(key1 == 0.5){
      language = 'eng';
    };

    if (language == 'chs') {

      wx.switchTab({
          url: '../restaurant/restaurant-home/index'

        });

    } else {
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})