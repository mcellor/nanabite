var app = getApp()
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
Page({
    data: {
        postlist: [],
        this_weiba_id: 0,
        hasMore: false,
        showLoading: false,
        isScrollY: true,
        this_page: 1,//当前页码
        pagesize: 10,//每页数量
        this_nav_name: 'index',
        this_is_jinghua: 0,
        this_finish_page: 0,
        glo_is_load: true,
        this_group_val: -1
    },
    //订单详情
    user_orderinfo_bind: function (e) {
        var oid = e.currentTarget.id;
        wx.navigateTo({
            url: '../restaurant-order-info/index?oid=' + oid
        });
    },
    //订单状态切换
    select_status_show: function (e) {
        this.setData({ this_page: 1, this_group_val: e.currentTarget.dataset.val });
        this.onShow();
    },
    //评价
    order_go_comment_bind: function (e) {
        var oid = e.currentTarget.id;
        wx.navigateTo({
            url: '../restaurant-order-comment/index?oid=' + oid
        });
    },
    //删除订单
    delete_user_order: function (e) {
        var that = this
        var oid = e.currentTarget.id;
        wx.showModal({
            title: '提示',
            content: "确认要删除该订单吗?",
            success: function (res) {
                if (res.confirm == true) {
                    requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/OrderApi/deleteUserOrder.html', { oid: oid }, (info) => {
                        that.onShow();
                    }, that, {});
                }
            }
        })
    },

    onShow: function () {
        var that = this;
        var requestData = {};
        requestData.pagesize = that.data.this_page;
        requestData.pagenum = that.data.pagesize;
        requestData.order_status = that.data.this_group_val;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/OrderApi/getUserOrderList.html', requestData, (info) => {

            if (info == null) {
                that.setData({ showLoading: false });
            } else {
                if (info.length >= that.data.pagesize) {
                    that.setData({ showLoading: true });
                } else {
                    that.setData({ showLoading: false });
                }
            }
            that.setData({ postlist: info, glo_is_load: false });
            wx.hideToast();
        }, this, {});
    },
    //下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        that.setData({
            this_page: 1,
            this_group_val: -1
        });
        that.onShow();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000)
    },
    onReachBottom: function (e) {
        var that = this;
        if (that.data.showLoading == true) {
            that.setData({ this_page: that.data.this_page + 1 });
        } else {
            return false;
        }
        var requestData = {};
        requestData.pagesize = that.data.this_page;
        requestData.pagenum = that.data.pagesize;
        requestData.order_status = that.data.this_group_val;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanDish/OrderApi/getUserOrderList.html', requestData, (info) => {
            if (info == null) {
                that.setData({ showLoading: false });
            } else {
                if (info.length >= that.data.pagesize) {
                    that.setData({ showLoading: true });
                } else {
                    that.setData({ showLoading: false });
                }
                that.setData({
                    postlist: that.data.postlist.concat(info)
                });
            }
            that.setData({ glo_is_load: false });
            wx.hideToast();
        }, this, {});
    },
    //开始支付
    order_go_pay_bind: function (e) {
        var that = this;
        var this_order_id = e.currentTarget.id;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        that.setData({buttonIsDisabled: true,submitIsLoading: true});
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/OrderApi/makePay.html', { oid: this_order_id }, (info) => {
            wx.requestPayment({
                'timeStamp': info.timeStamp,
                'nonceStr': info.nonceStr,
                'package': info.package,
                'signType': 'MD5',
                'paySign': info.paySign,
                'complete': function () {
                    //支付完成 刷新
                    that.onShow();
                }
            });
        }, that, {
            completeAfter: function () {
                that.setData({ buttonIsDisabled: false, submitIsLoading: false })
                }});
    }
})