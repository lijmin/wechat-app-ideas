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
    loadData: function() {
        ideaDao.getMyIdeas(app.globalData.openid, this.data.page, this.data.rows).then(res => {
            this.setData({
                loadMore: false,
                page: this.data.page + 1,
                ideas: this.data.ideas.concat(res)
            })
        })
    },
    //页面上拉触底事件的处理函数
    onReachBottom: function() {
        let that = this
        if (!that.data.loadMore) {
            that.setData({
                loadMore: true, //加载中  
            });
            this.loadData();
        }
    },
    bindlongpress: function(e) {
        const that = this;
        const id = e.currentTarget.dataset.id;
        let status = e.currentTarget.dataset.status;
        const index = e.currentTarget.dataset.index;
        status = status == 0 ? 1 : 0;

        this.showAction().then(res => {
            switch (res) {
                case 0:
                    this.shareIdea(index, id, status);
                    break;
                case 1:
                    tip.toast('占个坑')
                    break;
                case 2:
                    tip.confirm('确定删除吗').then(() => {
                        that.deleteIdea(index, id)
                    })
                    break;
            }
        })
    },
    //弹出操作列表
    showAction: function(index, id, status) {
        return new Promise((resolve, reject) => {
            wx.showActionSheet({
                itemList: ['公开/不公开', '修改', '删除'],
                success(res) {
                    resolve(res.tapIndex)
                },
                fail(res) {
                    reject(res)
                }
            })
        })
    },
    //公开
    shareIdea: function(index, id, status) {
        return ideaDao.shareIdea(id, status).then(res => {
            this.data.ideas[index].status = status;
            this.setData({
                ideas: this.data.ideas
            })
        })
    },
    //删除
    deleteIdea: function(index, id) {
        return ideaDao.deleteIdea(id).then(() => {
            this.data.ideas.splice(index, 1)
            this.setData({
                ideas: this.data.ideas
            })
        })
    }

})