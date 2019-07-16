// miniprogram/pages/idea/idea.js
import tip from '../../utils/tip';
import ideaDao from '../../dao/ideaDao';
import {
  formatTime
} from '../../utils/util.js';

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
        res.data.createTime = formatTime(res.data.createTime, 'yyyy-MM-dd hh:mm:ss');
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
  },
  /**
   * 预览
   */
  previewImage: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = e.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})