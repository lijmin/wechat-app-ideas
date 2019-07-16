// pages/edit-certification/edit-certification.js
import tip from '../../utils/tip';
import ideaDao from '../../dao/ideaDao';

const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        userInfo: null,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        images: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        // 查看是否授权
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: function (res) {
                            const userInfo = JSON.parse(res.rawData);
                            that.setData({
                                userInfo: userInfo
                            })
                           
                        }
                    })
                }
            }
        })
    },
    /**选择图片*/
    bindChooseImage: function(e) {
        const that = this;
        wx.chooseImage({
            count: 5,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                that.setData({
                    images: res.tempFilePaths
                })
            }
        })
    },
    /*提交表单 */
    formSubmit: function(e) {
        const title = e.detail.value.title;
        var content = e.detail.value.content; //备注
        if (title.length == 0) {
            tip.toast("请输入标题");
            return;
        }
        if (content.length == 0) {
            tip.toast("请填写您的想法");
            return;
        }

        this.setData({
            loading: true
        });
      
        if (this.data.images.length > 0) {
            this.uploadImage().then(res => {
                const ids = res.map(item => {
                    return item.fileID;
                })
                return ideaDao.addIdea(this.data.userInfo.nickName, this.data.userInfo.avatarUrl, title, content, ids);
            }).then(res => {
                tip.toast('添加成功')
                this.setData({
                    loading: false
                });
                wx.navigateBack({
                    
                })
            }).catch(err => {
                console.log(err)
            });
        } else {
            ideaDao.addIdea(this.data.userInfo.nickName, this.data.userInfo.avatarUrl,title, content).then(res => {
                tip.toast('添加成功')
                this.setData({
                    loading: false
                });
                wx.navigateBack({
                    
                })
            }).catch(err => {
                console.log(err)
            });
        }

    },
    //上传图片
    uploadImage: function() {
        //将选择的图片组成一个Promise数组，准备进行并行上传
        let uploads = this.data.images.map((filePath, index) => {
            return new Promise((resolve, reject) => {
                const cloudPath = new Date().getTime() + filePath.match(/\.[^.]+?$/)[0]
                wx.cloud.uploadFile({
                    cloudPath, // 上传至云端的路径
                    filePath, // 小程序临时文件路径
                    success: resolve,
                    fail: reject
                })
            });
        });
        return Promise.all(uploads);
    },
    bindGetUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo
        })
    }
})