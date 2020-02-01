/**
 * @description user-relation
 */
const { User, UserRelation } = require("../db/model/index");
const { formatUser } = require("./_format");

/**
 * 获取关注该用户的用户列表，即该用户的粉丝
 *
 * @param {*} followerId 被关注人的用户id
 * @returns
 */
async function getUsersByFollower(followerId) {
  const result = await User.findAndCountAll({
    attributes: ["id", "userName", "nickName", "picture"],
    order: [["id", "desc"]],
    include: [
      {
        model: UserRelation,
        where: {
          followerId
        }
      }
    ]
  });

  // result.count 总数
  // result.rows 查询结果，数组

  let userList = result.rows.map(row => row.dataValues);
  userList = formatUser(userList);

  return {
    count: result.count,
    userList
  };
}

/**
 * 获取关注人列表
 *
 * @param {*} userId
 * @returns
 */
async function getFollowersByUser(userId) {
  const result = await UserRelation.findAndCountAll({
    order: [["id", "desc"]],
    include: [
      {
        model: User,
        attributes: ["id", "userName", "nickName", "picture"]
      }
    ],
    where: {
      userId
    }
  });

  // result.count 总数
  // result.rows 查询结果，数组
  let userList = result.rows.map(row => row.dataValues);
  userList = userList.map(item => {
    let user = item.user;
    user = user.dataValues;
    user = formatUser(user);
    return user;
  });

  return {
    count: result.count,
    userList
  };
}

async function addFollower(userId, followerId) {
  const result = await UserRelation.create({
    userId,
    followerId
  });
  return result.dataValues;
}

async function deleteFollower(userId, followerId) {
  const result = await UserRelation.destroy({
    where: {
      userId,
      followerId
    }
  });
  return result > 0;
}

module.exports = {
  getUsersByFollower,
  getFollowersByUser,
  addFollower,
  deleteFollower
};
