import tip from '../../utils/tip';
import ideaDao from '../../dao/ideaDao';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        images: [],
        title: null,
        content: null,
        oldImages: [],
        newImages: [],
        id: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options && options.ideaId) {
            const id = options.ideaId;
            ideaDao.getIdeaById(id).then(res => {
                this.setData({
                    images: res.data.images,
                    title: res.data.title,
                    content: res.data.content,
                    oldImages: res.data.images,
                    id: res.data._id
                })
            })
        }
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
                    images: res.tempFilePaths,
                    newImages: res.tempFilePaths
                })
            }
        })
    },

    /*提交表单 */
    formSubmit: function (e) {
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

        if (this.data.newImages.length > 0) {
            this.uploadImage().then(res => {
                const ids = res.map(item => {
                    return item.fileID;
                })
                return ideaDao.updateIdea(this.data.id, title, content, this.data.oldImages, ids);
            }).then(res => {
                this.updateSuccess();
            }).catch(err => {
                console.log(err)
            });
        } else {
            ideaDao.updateIdea(this.data.id, title, content, null, this.data.oldImages).then(res => {
                this.updateSuccess();
            }).catch(err => {
                console.log(err)
            });
        }

    },

    //上传图片
    uploadImage: function() {
        //将选择的图片组成一个Promise数组，准备进行并行上传
        let uploads = this.data.newImages.map((filePath, index) => {
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

    /**
     * 修改成功
     */
    updateSuccess: function(){
        tip.toast('修改成功')
        this.setData({
            loading: false
        });
    }
})