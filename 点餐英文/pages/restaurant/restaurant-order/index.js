const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
var app = getApp();
Page({
    data: {
        dish_data: [],
        data_list: [],
        this_dish_id: 0,
        this_table_id: 0,
        this_table_name: '',
        this_table_list: null,
        is_show_table_select: false,
        is_show_table_layer: false,
        is_show_quan_layer: false,
        this_order_type: 1,
        all_g_number: 0,
        all_g_price: 0,
        all_g_yunfei: 0,
        all_g_dabao_price: 0,
        this_peisong_jiner: 0,
        is_show_address: false,
        address_list: null,
        this_address_id: 0,
        this_address_info: '请选择',
        btn_submit_disabled: false,
        submitIsLoading: false,
        glo_is_load: true,
        select_pay_type: false,
        this_select_paytype:1,
        this_quan_id: 0,
        this_quan_info: '请选择',
        this_quan_jiner: 0,
        wx_address_info: '',
        quan_list: null,
        this_beizhu_info: '口味、偏好等',
        yc_array: ['1人', '2人', '3人', '4人', '5人', '6人', '7人', '8人', '9人', '10人', '10人以上'],
        yc_index: -1,
        this_yongcan_renshu: 0,
        this_fapiao_info: '商家不支持开发票',
        this_fapiao_data: null
    },
    bindYcPickerChange: function (e) {
        var t_yc_arr = this.data.yc_array;
        this.setData({ yc_index: e.detail.value, this_yongcan_renshu: t_yc_arr[e.detail.value] });
    },
    go_select_dai_bind: function () {
        var that = this;
        //加载用户优惠券
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/Api/getUserQuanList.html', { dish_id: that.data.this_dish_id }, (info) => {
            that.setData({ quan_list: info });
        }, that, {
            completeAfter: function () {
                that.setData({ is_show_quan_layer: that.data.is_show_quan_layer ? false : true});
            }
            });
    },
    go_select_dai__hide_bind: function () {
        var that = this;
        that.setData({ is_show_quan_layer: that.data.is_show_quan_layer ? false : true });
    },
    //选择桌号
    selectTable_bind: function (e) {
        this.setData({ this_table_id: e.detail.value });
        this.getTableInfo();
        this.show_table_layout_bind();
    },
    show_table_layout_bind: function () {
        if (this.data.dish_data.dish_info.dish_is_zhuohao_change == 0){
            return false;
        }
        this.setData({ is_show_table_layer: this.data.is_show_table_layer ? false : true });
    },
    //选择代金券
    quan_select_one_bind: function (e) {
        var that = this;
        that.setData({
            this_quan_id: e.currentTarget.dataset.id,
            this_quan_info: '代金券 -' + e.currentTarget.dataset.jiner + '元',
            this_quan_jiner: e.currentTarget.dataset.jiner
        });
        that.setData({ is_show_quan_layer: that.data.is_show_quan_layer ? false : true });
    },
    //选择发票
    select_fapiao_bind: function () {
        var that = this;
        if (that.data.dish_data.dish_info.dish_is_fapiao == 0) {
            return false;
        } else {
            wx.navigateTo({
                url: '../restaurant-invoice/index?dish_id=' + that.data.this_dish_id
            });
        }
    },

    onLoad: function (options) {
        var that = this;
        var post_id = options.dish_id||0;
        var table_id = options.table_id||0;
        var order_type = wx.getStorageSync('global_order_type' + post_id);
        var quan_id = options.quan_id || 0;
        var quan_jiner = options.quan_jiner || 0;
        var quan_info = '';
        if (quan_jiner == 0) {
            quan_info = '请选择';
        } else {
            quan_info = '-' + quan_jiner + '元优惠券';
        }
        that.setData({
            this_dish_id: post_id,
            this_table_id: table_id,
            this_order_type: order_type,
            this_quan_id: quan_id,
            this_quan_jiner: quan_jiner,
            this_quan_info: quan_info
        });
    },
    onShow: function () {
        if (wx.getStorageSync('is_no_show_load') == 1) {
            return false;
        }
        var that = this;
        if (wx.getStorageSync('dish_order_beizhu' + that.data.this_dish_id)) {
            that.setData({ this_beizhu_info: wx.getStorageSync('dish_order_beizhu' + that.data.this_dish_id) });
        }
        var rq_data = {};
        rq_data.dish_id = that.data.this_dish_id;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/Api/getOrderDishInfo.html', rq_data, (info) => {
            if (that.data.this_order_type == 2) {
                info.dish_info.waimai_peisong_jiner = parseInt(info.dish_info.waimai_peisong_jiner);
            } else {
                info.dish_info.waimai_peisong_jiner = parseInt(0);
                if (info.dish_info.dish_is_zhuohao_change == 0 && that.data.this_table_id == 0) {

                }
            }
            if (info.dish_info.dish_is_fapiao == 0) {
                that.setData({ this_fapiao_info: '商家不支持开发票', this_fapiao_data: null });
            } else {
                if (wx.getStorageSync('dish_fapiao_select')) {
                    var fapiao_s_data = wx.getStorageSync('dish_fapiao_select');
                    that.setData({ this_fapiao_info: fapiao_s_data.title, this_fapiao_data: fapiao_s_data });
                } else {
                    that.setData({ this_fapiao_info: '不需要发票', this_fapiao_data: null });
                }
            }
            that.setData({
                dish_data: info,
                dish_yingye_status_val: info.dish_info.is_yingye_status,
                this_table_list: info.dish_table_list
            });
            if (that.data.this_peisong_jiner == 0) {
                that.setData({ this_peisong_jiner: info.dish_info.waimai_peisong_jiner });
            }
            //请求购物车信息
            var rq_data = {};
            rq_data.dish_id = that.data.this_dish_id;
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/Api/getCartList.html', rq_data, (info) => {
                that.setData({
                    data_list: info,
                    all_g_number: info.all_g_number,
                    all_g_price: info.all_g_price,
                    all_g_yunfei: info.all_g_yunfei,
                    all_g_dabao_price: info.all_g_dabao_price,
                    glo_is_load: false
                });
                if (that.data.this_order_type == 1) {
                    that.setData({ all_g_dabao_price: 0 });
                }
                //读取收货地址
                if (that.data.this_order_type == 2) {
                    that.getAddressInfo();
                }
                that.getTableInfo();
            }, this, { isShowLoading: false });

        }, this, { isShowLoading: true, loadingText: '订单更新中' });
    },
    //订单备注
    go_oderbeizhu_bind: function () {
        var that = this;
        wx.navigateTo({
            url: '../restaurant-remark/index?dish_id=' + that.data.this_dish_id
        });
    },

    getTableInfo: function () {
        //获取桌号名称
        var that = this;
        var rq_data = {};
        rq_data.dish_id = that.data.this_dish_id;
        rq_data.table_id = that.data.this_table_id;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/Api/getDishTableInfo.html', rq_data, (info) => {
            that.setData({ this_table_id: info.table_id, this_table_name: info.table_name });
        }, this, { isShowLoading: false });
    },
    //获取用户收货地址
    getAddressInfo: function () {
        var that = this;
        var aid = wx.getStorageSync("dish_select_address_id");
        if(aid && aid > 0){
            requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanUser/ApiAddress/getAddresssInfo.html', { fapiao_id: aid }, (info) => {
                var wx_address = {};
                wx_address.userName = info.consignee;
                wx_address.telNumber = info.mobile;
                wx_address.detailInfo = info.address + info.buchong;
                wx_address.u_lat = info.u_lat;
                wx_address.u_lng = info.u_lng;
                //验证收货地址
                var requestData = {};
                requestData.dish_id = that.data.this_dish_id;
                requestData.u_lat = info.u_lat;
                requestData.u_lng = info.u_lng;
                requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/Api/checkPeisongAddressLimitByGps.html', requestData, (juliInfo) => {
                    that.setData({ this_peisong_jiner: parseInt(juliInfo), wx_address_info: wx_address});
                }, that, { isShowLoading: false, loadingText: '验证收货地址中' });
                wx.hideToast();
            }, this, { isShowLoading: false});
        }
    },

    go_select_paytype_bind: function () {
        var that = this;
        if (that.data.select_pay_type == true) {
            that.setData({ select_pay_type: false });
        } else {
            that.setData({ select_pay_type: true });
        }
    },
    //选择收货地址
    select_address_bind: function () {
        var that = this;
        wx.navigateTo({
            url: '../restaurant-addAdress/index?dish_id=' + that.data.this_dish_id
        });
        return false;
    },
    //提交订单并支付
    order_formSubmit: function (e) {
        var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        that.setData({
            btn_submit_disabled: true,
            submitIsLoading: true
        });
        var order_info = e.detail.value;
        order_info.dish_id = that.data.this_dish_id;
        order_info.order_type = that.data.this_order_type;
        order_info.quan_id = that.data.this_quan_id;
        order_info.manjian_id = that.data.data_list.is_huodong_mianjian_id;
        order_info.shou_id = that.data.data_list.is_huodong_shou_id;
        order_info.wx_address = that.data.wx_address_info;
        order_info.this_beizhu_info = that.data.this_beizhu_info;
        order_info.this_yongcan_renshu = that.data.this_yongcan_renshu;
        if (that.data.this_fapiao_data != null) {
            order_info.this_fapiao_id = that.data.this_fapiao_data.id;
        } else {
            order_info.this_fapiao_id = 0;
        }
        if (that.data.this_table_list != null && that.data.this_table_id == 0 && that.data.this_order_type == 1) {
            wx.showModal({
                title: '提示',
                content: "请选择桌号",
                showCancel: false,
                success: function () {
                    that.show_table_layout_bind();
                }
            });
            that.go_select_paytype_bind();
            wx.hideToast();
            that.setData({ btn_submit_disabled: false, submitIsLoading: false });
            return false;
        }
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/OrderApi/postOrder.html', { oinfo: order_info }, (info) => {
            wx.setStorageSync('dish_order_beizhu' + that.data.this_dish_id, null);
            wx.setStorageSync('dish_fapiao_select', null);
            wx.setStorageSync('this_dish_cart_' + that.data.this_dish_id, {});
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
                            wx.redirectTo({
                                url: '../restaurant-order-info/index?oid=' + info.order_id
                            });
                        }
                    });
                },
                'fail': function (res) {
                    wx.showModal({
                        title: '提示',
                        content: "支付失败,请稍后到我的订单中可继续支付",
                        showCancel: false,
                        success: function (res) {
                            wx.redirectTo({
                                url: '../restaurant-order-info/index?oid=' + info.order_id
                            });
                        }
                    });
                }
            });
            wx.hideToast();
            that.setData({ btn_submit_disabled: false, submitIsLoading: false });

        }, this, {
            isShowLoading: false, error: function (code, msg) {
                wx.hideToast();
                that.setData({ btn_submit_disabled: false, submitIsLoading: false });
                if (code == 5) {
                    wx.showModal({
                        title: '提示',
                        content: msg,
                        showCancel: false
                    });
                    that.go_select_paytype_bind();
                    return false;
                }
                if (code == 9) {
                    wx.setStorageSync('dish_order_beizhu' + that.data.this_dish_id, null);
                    wx.setStorageSync('dish_fapiao_select', null);
                    wx.setStorageSync('this_dish_cart_' + that.data.this_dish_id, {});
                    wx.showModal({
                        title: '提示',
                        content: "订单提交成功",
                        showCancel: false,
                        success: function (res) {
                            wx.redirectTo({
                                url: '../restaurant-order-info/index?oid=' + msg.order_id
                            });
                        }
                    });
                }

            }
            });
    }
})