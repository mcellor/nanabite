const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
var app = getApp()
Page({
    data:{
        this_options:null,
        this_order_id:0,
        oinfo:[],
        glo_is_load:true
    },
    go_dish_info_bind:function(e){
        var that = this;
        var dish_id = e.currentTarget.id;
        wx.reLaunch({
            url: '../restaurant-home-info/index?dish_id='+dish_id
        });
    },
    onLoad:function(options){
        var that = this;
        var order_id = options.oid;
        that.setData({ this_order_id: order_id, this_options: options});
      //请求订单详情
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/OrderApi/orderInfo.html', { oid: that.data.this_order_id }, (info) => {
            that.setData({ oinfo: info, glo_is_load: false });
        }, that, {});
    },
    //支付
    order_go_pay_bind:function(){
        var order_id = this.data.this_order_id
        wx.redirectTo({
            url: '../../../shop/orderpay/index?order_id=' + order_id
        })
    },
    //打电话
    bind_call_phone:function(){
      if (this.data.oinfo.peisong_user_phone){
        wx.makePhoneCall({
          phoneNumber: this.data.oinfo.peisong_user_phone
        });
      }
    },
    //评论
    order_go_comment_bind:function(){
        var order_id = this.data.this_order_id
        wx.redirectTo({
            url: '../comment/index?order_id=' + order_id
        })
    },
    //下拉刷新
    onPullDownRefresh:function(){
      var that = this;
      that.onLoad(that.data.this_options);
      setTimeout(()=>{
        wx.stopPullDownRefresh()
      },1000)
    },
})