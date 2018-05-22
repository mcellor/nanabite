const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
var app = getApp();
Page({
    data: {
        dish_data: [],
        this_dish_id: 0,
        this_beizhu_info:''
    },
    onLoad:function(op){
        this.setData({this_dish_id:op.dish_id});
    },
    onShow: function () {
        var that = this;
        var rq_data = {};
        rq_data.dish_id = that.data.this_dish_id;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/Api/getDishInfo.html', rq_data, (info) => {
            that.setData({dish_data:info});
        }, this, {});
    },
    //选择备注
    select_beizhu_bind: function (e) {
        var beizhu_info = this.data.this_beizhu_info;
        beizhu_info = beizhu_info + e.currentTarget.dataset.info + ' ';
        this.setData({ this_beizhu_info: beizhu_info });
    },
    //设置缓存
    beizhu_formSubmit:function(e){
        wx.setStorageSync('dish_order_beizhu' + this.data.this_dish_id, e.detail.value.beizhu);
        wx.navigateBack({delta: 1});
    }
})