import {
    formatTime
} from '../utils/util.js';
/**
 * idea数据库操作
 */
export default class IdeaDao {

    constructor() {
        this.database = 'idea';
    }

    // 添加想法
    static addIdea(nickName, avatarUrl, title, content, images) {
        const db = wx.cloud.database()
        return db.collection(IdeaDao.database).add({
            data: {
                nickName: nickName,
                avatarUrl: avatarUrl,
                status: 0,
                createTime: new Date(),
                title: title,
                content: content,
                images: images
            }
        })
    }
    /**
     * 获取我的想法
     */
    static getMyIdeas(openId, page, rows) {
        const db = wx.cloud.database()
        return new Promise((resolve, reject) => {
            db.collection(IdeaDao.database).where({
                    _openid: openId
                })
                .orderBy('createTime', 'desc')
                .skip(page * rows)
                .limit(rows)
                .get({
                    success: res => {
                        let r = res.data.map((item) => {
                            return {
                                avatarUrl: item.avatarUrl,
                                nickName: item.nickName,
                                _id: item._id,
                                images: item.images,
                                title: item.title,
                                content: item.content,
                                status: item.status,
                                createTime: formatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss')
                            }
                        })
                        resolve(r)
                    },
                    fail: reject
                })
        })
    }
    /**
     * 获取公开的想法
     */
    static getIdeas(page, rows) {
        const db = wx.cloud.database()
        return new Promise((resolve, reject) => {
            db.collection(IdeaDao.database).where({
                    status: 1
                })
                .orderBy('createTime', 'desc')
                .skip(page * rows)
                .limit(rows)
                .get({
                    success: res => {
                        let r = res.data.map((item) => {
                            return {
                                avatarUrl: item.avatarUrl,
                                nickName: item.nickName,
                                _id: item._id,
                                images: item.images,
                                title: item.title,
                                content: item.content,
                                status: item.status,
                                createTime: formatTime(item.createTime, 'yyyy-MM-dd hh:mm:ss')
                            }
                        })
                        resolve(r)
                    },
                    fail: reject
                })
        })
    }
    /**
     * 公开想法
     */
    static shareIdea(id, status) {
        const db = wx.cloud.database()
        return db.collection(IdeaDao.database)
            .doc(id)
            .update({
                data: {
                    status: status
                }
            })
    }
    /**
     * 删除想法
     */
    static deleteIdea(id) {
        const db = wx.cloud.database()

        return db.collection(IdeaDao.database)
            .doc(id)
            .remove();
    }
    /**
     * 获取单个想法
     */
    static getIdeaById(ideaId) {
        const db = wx.cloud.database()
        return db.collection(IdeaDao.database)
            .doc(ideaId)
            .get();
    }
}

IdeaDao.database = 'idea';