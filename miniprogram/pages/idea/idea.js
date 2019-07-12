// miniprogram/pages/idea/idea.js
import tip from '../../utils/tip';
import ideaDao from '../../dao/ideaDao';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        idea: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options && options.ideaId) {
            const id = options.ideaId;
            ideaDao.getIdeaById(id).then(res => {
                this.setData({
                    idea: res.data
                })
            })
        }
        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '这是一个脑洞大开的世界',
            path: '/pages/idea/idea?ideaId=' + this.data.idea._id,
            imageUrl: '', //'/images/me_img08.png'
        }
    }
})