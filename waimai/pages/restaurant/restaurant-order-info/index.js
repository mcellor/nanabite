const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
var app = getApp()
Page({
    data:{
        this_options:null,
        dish_data:{},
        this_order_id:0,
        oinfo:[],
        glo_is_load:true,
        select_pay_type:false
    },
    go_dish_info_bind:function(e){
        var that = this;
        var dish_id = e.currentTarget.id;
        wx.reLaunch({
            url: '../restaurant-home-info/index?dish_id='+dish_id
        });
    },
    //添加菜品
    add_order_goods_bind:function(){
        wx.reLaunch({
            url: '/pages/restaurant/restaurant-single/index?dish_id=' + this.data.oinfo.dish_id+'&order_type=1'+'&order_id='+this.data.oinfo.id
        });
    },
    onLoad:function(options){
        var that = this;
        var order_id = options.oid;
        that.setData({ this_order_id: order_id, this_options: options});
      //请求订单详情
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/ApiNewOrder/orderInfo.html', { oid: that.data.this_order_id }, (info) => {
            that.setData({ oinfo: info});
            //获取门店信息
            var rq_data = {};
            rq_data.dish_id = info.dish_id;
            rq_data.order_type = info.order_type;
            rq_data.is_ziqu = info.is_ziqu;
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/Api/getOrderDishInfo.html', rq_data, (dinfo) => {
                that.setData({ dish_data: dinfo, select_pay_type:false, glo_is_load: false});
            }, this, { isShowLoading: false});
            
        }, that, {});
    },
    //选择支付方式
    go_select_paytype_bind: function () {
        var that = this;
        if (that.data.select_pay_type == true) {
            that.setData({ select_pay_type: false });
        } else {
            that.setData({ select_pay_type: true });
        }
    },
    //进行支付
    order_payConfirm:function(e){
        var that = this;
        let dish_pay_type = e.detail.value.dish_pay_type;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        that.setData({ btn_submit_disabled: true, submitIsLoading: true });
        let rData = {};
        rData.pay_type = dish_pay_type;
        rData.order_id = that.data.this_order_id;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/ApiNewOrder/orderGoPay.html', rData, (info) => {
            wx.requestPayment({
                'timeStamp': info.timeStamp,
                'nonceStr': info.nonceStr,
                'package': info.package,
                'signType': 'MD5',
                'paySign': info.paySign,
                'success': function (res) {
                    wx.showModal({
                        title: '提示',
                        content: "订单支付成功",
                        confirmText: "查看订单",
                        showCancel: false,
                        success: function (res) {
                            that.onLoad(that.data.this_options);
                        }
                    });
                }
            });
            wx.hideToast();
            that.setData({ btn_submit_disabled: false, submitIsLoading: false});
        }, this, {
                isShowLoading: false, error: function (code, msg) {
                    wx.hideToast();
                    that.setData({ btn_submit_disabled: false, submitIsLoading: false });
                    if (code == 5) {
                        wx.showModal({
                            title: '提示',
                            content: msg,
                            showCancel: false,
                            success:function(){
                                that.onLoad(that.data.this_options);
                            }
                        });
                        return false;
                    }
                    if (code == 9) {
                        wx.setStorageSync('dish_order_beizhu' + that.data.this_dish_id, null);
                        wx.setStorageSync('dish_fapiao_select', null);
                        wx.setStorageSync('this_dish_cart_' + that.data.this_dish_id, {});
                        wx.showModal({
                            title: '提示',
                            content: "订单支付成功",
                            showCancel: false,
                            success: function (res) {
                                that.onLoad(that.data.this_options);
                            }
                        });
                    }

                }
            });
    },
    //打电话
    bind_call_phone:function(){
      if (this.data.oinfo.peisong_user_phone){
        wx.makePhoneCall({
          phoneNumber: this.data.oinfo.peisong_user_phone
        });
      }
    },
    //电话
    call_phone_bind: function () {
        var that = this;
        wx.makePhoneCall({phoneNumber: that.data.dish_data.dish_info.dish_con_mobile});
    },
    //导航
    get_location_bind: function () {
        wx.showToast({
            title: '地图加载中',
            icon: 'loading',
            duration: 10000,
            mask: true
        });
        var that = this;
        var loc_lat = that.data.dish_data.dish_info.dish_gps_lat;
        var loc_lng = that.data.dish_data.dish_info.dish_gps_lng;
        wx.openLocation({
            latitude: parseFloat(loc_lat),
            longitude: parseFloat(loc_lng),
            scale: 18,
            name: that.data.dish_data.dish_info.dish_name,
            address: that.data.dish_data.dish_info.dish_address
        });
        wx.hideToast();
    },
    //评论
    order_go_comment_bind:function(){
        var order_id = this.data.this_order_id
        wx.navigateTo({url: '../restaurant-order-comment/index?oid=' + order_id});
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