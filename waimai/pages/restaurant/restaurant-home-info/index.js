var _jsonsort = require('../../../utils/common');
const requestUtil = require('../../../utils/requestUtil');
const _DuoguanData = require('../../../utils/data');
var app = getApp();
Page({
    data: {
        this_options: {},
        this_dish_id: 0,
        this_dish_info: '',
        this_dish_type: '',
        glo_is_load: false,
        this_is_card_open:false,
        this_is_user_card: 0,
        this_user_card_info: null,
        this_open_mini:0
    },
    webview_formsubmit: function (e) {
        var that = this;
        wx.navigateTo({
            url: '../webview_jianjie/index?dish_id=' + that.data.this_dish_id
        });
    },
    openmini_formsubmit:function(e){
        let dinfo = this.data.this_dish_info;
        wx.navigateToMiniProgram({
            appId: dinfo.dish_tomini_appid,
            path: dinfo.dish_tomini_appurl,
            success(res) {
                
            },
            fail:function(res){
                console.log(res);
            }
        })
    },
    diancan_formsubmit: function (e) {
        var that = this;
        var form_id = e.detail.formId;
        that.insertFormID(form_id);

        if (that.data.this_dish_info.dish_is_diannei == 1) {
            if (that.data.this_dish_info.dish_is_rcode_open == 1) {
                wx.scanCode({
                    success: (res) => {
                        //添加到扫码日志
                        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/Api/addScodeLog.html', { path: res.path }, (info) => {

                        }, that, { isShowLoading: false });
                        if (res.path) {
                            wx.navigateTo({
                                url: '/' + res.path
                            });
                        }
                    }
                });
            } else {
                wx.navigateTo({
                    url: '../restaurant-single/index?dish_id=' + that.data.this_dish_id + '&order_type=1&is_ziqu=0'
                });
            }
        } else {
            wx.showModal({
                title: '提示',
                content: "对不起，暂不支持店内点餐",
                showCancel: false
            });
            return;
        }
    },
    //自提
    ziqu_formsubmit:function(e){
        var that = this;
        var form_id = e.detail.formId;
        that.insertFormID(form_id);

        if (that.data.this_dish_info.dish_is_ziqu == 1) {
            wx.navigateTo({
                url: '../restaurant-single/index?dish_id=' + that.data.this_dish_id + '&order_type=1&is_ziqu=1'
            });
        } else {
            wx.showModal({
                title: '提示',
                content: "对不起，暂不支持自提",
                showCancel: false
            });
            return;
        }
    },
    go_dish_index_bind: function () {
        wx.switchTab({
            url: '/pages/restaurant/restaurant-home/index',
            fail:function(){
                wx.navigateTo({
                    url: '/pages/restaurant/restaurant-home/index',
                })
            }
        })
    },
    //预订
    yuding_formsubmit: function (e) {
        var that = this;
        var form_id = e.detail.formId;
        that.insertFormID(form_id);
        if (that.data.this_dish_info.dish_is_yuding == 1) {
            wx.navigateTo({
                url: '../restaurant-reserve/index?dish_id=' + that.data.this_dish_id
            });
        } else {
            wx.showModal({
                title: '提示',
                content: "对不起，暂不支持预定",
                showCancel: false
            });
            return;
        }
    },
    //排队
    paidui_formsubmit: function (e) {
        var that = this;
        var form_id = e.detail.formId;
        that.insertFormID(form_id);
        if (that.data.this_dish_info.dish_is_paidui == 1) {
            wx.navigateTo({
                url: '../paidui/index?dish_id=' + that.data.this_dish_id
            });
        } else {
            wx.showModal({
                title: '提示',
                content: "对不起，暂不支持排队",
                showCancel: false
            });
            return;
        }
    },
    insertFormID: function (form_id) {
        var that = this;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php?s=/addon/DuoguanUser/Api/addUserFormId.html', { form_id: form_id }, (info) => {

        }, that, { isShowLoading: false });
    },
    //外卖
    waimai_formsubmit: function (e) {
        var that = this;
        var form_id = e.detail.formId;
        that.insertFormID(form_id);
        if (that.data.this_dish_info.dish_is_waimai == 1) {
            wx.navigateTo({
                url: '../restaurant-single/index?dish_id=' + that.data.this_dish_id + '&order_type=2'
            });
        } else {
            wx.showModal({
                title: '提示',
                content: "对不起，暂不支持外卖",
                showCancel: false
            });
            return;
        }
    },
    //转账
    zhuanzhang_bind: function (e) {
        wx.navigateTo({
            url: '../pay/index?dish_id=' + e.currentTarget.id
        });
    },
    //通用跳转
    go_nav_url_base: function (e) {
        wx.navigateTo({ url: e.currentTarget.dataset.url });
    },
    //日志
    go_card_log_bind: function () {
        var that = this;
        wx.navigateTo({
            url: '../restaurant-card-log/index?dish_id=' + that.data.this_dish_id
        });
    },
    //我的会员卡
    go_user_card_info: function () {
        wx.navigateTo({
            url: "../restaurant-card/index?dish_id=" + this.data.this_dish_id
        });
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
        var loc_lat = that.data.this_dish_info.dish_gps_lat;
        var loc_lng = that.data.this_dish_info.dish_gps_lng;
        wx.openLocation({
            latitude: parseFloat(loc_lat),
            longitude: parseFloat(loc_lng),
            scale: 18,
            name: that.data.this_dish_info.dish_name,
            address: that.data.this_dish_info.dish_address
        });
    },
    //电话
    call_phone_bind: function () {
        var that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.this_dish_info.dish_con_mobile
        });
    },
    onLoad: function (options) {
        var that = this;
        that.setData({
            this_options: options,
            this_dish_id: options.dish_id
        });
    },
    onShow: function () {
        wx.hideToast();
        this.loadSingleDishData();
    },
    loadSingleDishData: function () {
        var that = this;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanDish/Api/getDishOneInfo.html', { dish_id: that.data.this_dish_id }, (info) => {
            wx.setStorageSync("dish_ischeck_mobile", info.dish_is_sms_check || 0);
            that.setData({ this_dish_info: info, glo_is_load: false, this_open_mini:0});
            wx.setNavigationBarTitle({ title: info.dish_name });
            wx.hideToast();
            if (info.dish_is_open_tomini == 1) {
                that.setData({this_open_mini:1});
                return false;
            }
            //验证用户是否已领取会员卡
            if (info.card_open_status == 1) {
                that.setData({ this_is_card_open:true});
                that.check_user_is_card();
            }else{
                that.setData({ this_is_card_open: false });
            }
        }, that, { isShowLoading: false });
    },
    check_user_is_card: function () {
        var that = this;
        var requestData = {};
        requestData.module_name = 'DuoguanDish';
        requestData.shop_id = that.data.this_dish_id;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanMemberCard/Api/userIsCard.html', requestData, (info) => {
            that.setData({ this_is_user_card: info });
            if (info == 1) {
                //读取会员卡信息
                that.get_user_card_info();
            }
        }, that, { isShowLoading: false });
    },
    get_user_card_info: function () {
        var that = this;
        var requestData = {};
        requestData.module_name = 'DuoguanDish';
        requestData.shop_id = that.data.this_dish_id;
        requestUtil.get(_DuoguanData.duoguan_host_api_url + '/index.php/addon/DuoguanMemberCard/Api/getCardInfo.html', requestData, (info) => {
            if (info.is_new == 1) {
                wx.showModal({
                    title: '提示',
                    content: "会员卡领取成功",
                    showCancel: false
                });
            }
            that.setData({ this_is_user_card: 1, this_user_card_info: info });
        }, that, { isShowLoading: true });
    },
    //图片放大
    img_max_bind: function (e) {
        var that = this;
        wx.previewImage({ current: e.target.dataset.url, urls: that.data.this_dish_info.dish_shijing_arr });
    },
    img_max_bind_zz: function (e) {
        var that = this;
        wx.previewImage({ current: e.target.dataset.url, urls: that.data.this_dish_info.dish_zizhi_arr });
    },
    //下拉刷新
    onPullDownRefresh: function () {
        var that = this;
        that.loadSingleDishData();
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 1000);
    },
    onShareAppMessage: function () {
        var that = this;
        var shareTitle = that.data.this_dish_info.dish_name;
        var shareDesc = that.data.this_dish_info.dish_jieshao;
        var sharePath = 'pages/restaurant/restaurant-home-info/index?d_type=single&dish_id=' + that.data.this_dish_id;
        return {
            title: shareTitle,
            desc: shareDesc,
            path: sharePath
        }
    },
})