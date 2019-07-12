// miniprogram/pages/ideas/ideas.js
import tip from '../../utils/tip';
import ideaDao from '../../dao/ideaDao';

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ideas: [],
        page: 0,
        rows: 10,
        loadMore: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadData();
    },
    loadData: function(){
        ideaDao.getIdeas(this.data.page, this.data.rows).then(res => {
            this.setData({
                loadMore: false,
                page: this.data.page + 1,
                ideas: this.data.ideas.concat(res)
            })
        })
    },
    //下拉刷新
    onPullDownRefresh: function () {
        setTimeout(function () {
            wx.stopPullDownRefresh();
        }, 1500);
        this.data.page = 0;
        this.data.ideas.length = 0;
        this.loadData();
    },

    //页面上拉触底事件的处理函数
    onReachBottom: function () {
        if (!this.data.loadMore) {
            this.setData({
                loadMore: true, //加载中  
            });
            this.loadData();
        }
    },

})