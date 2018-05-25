/**
 * 游戏数据模型
 *
 * 作为游戏的抽象，保存了游戏的各种数据，例如玩家的位置
 *
 * @return {void}
 */
const GameModel = new Object();

/**
 * 游戏玩家对象，0是玩家，1是电脑
 *
 * 玩家对象，暂时只有两个玩家，下面的方法可以用playerIndex来访问具体的玩家单位
 *
 */
GameModel.players = new Array();

/**
 * 时间戳
 *
 * 一个以毫秒为单位的时间戳，初始为0
 *
 */
GameModel.timeStamp = 0;

/**
 * 宽和高
 *
 * 游戏的宽度和高度
 *
 */
GameModel.width = window.innerWidth;
GameModel.height = window.innerHeight;

/**
 * 攻击距离和高度差判断
 *
 */
GameModel.attackLength = 170;
GameModel.attackHeight = 200;

/**
 * 初始化
 *
 * 进行数据的初始化操作
 *
 * @return {void}
 */
GameModel.init = function() {
    GameModel.players = new Array();
    GameModel.players.push(new Player());
    GameModel.players.push(new Player());

    for (let i = 0; i < GameModel.players.length; i++) {
        GameModel.players[i].ground = GameModel.height;
        GameModel.players[i].y = GameModel.height;
    }
    GameModel.players[0].face = 'right';
    GameModel.players[0].x = 56;
    GameModel.players[1].face = 'left';
    GameModel.players[1].x = GameModel.width - 56;
    GameModel.timeStamp = (new Date()).getTime();
};

/**
 * 向左走
 *
 * 使得指定的玩家往左走
 *
 * @param {int} playerIndex
 * @return {void}
 */
GameModel.left = function(playerIndex) {
    GameModel._verify(playerIndex);
    GameModel.players[playerIndex].face = 'left';
    GameModel.players[playerIndex].speed = GameModel.players[playerIndex].speedMove;
    GameModel.players[playerIndex].moveStart = (new Date()).getTime();
};

/**
 * 向右走
 *
 * 使得指定的玩家往右走
 *
 * @param {int} playerIndex
 * @return {void}
 */
GameModel.right = function(playerIndex) {
    GameModel._verify(playerIndex);
    GameModel.players[playerIndex].face = 'right';
    GameModel.players[playerIndex].speed = GameModel.players[playerIndex].speedMove;
    GameModel.players[playerIndex].moveStart = (new Date()).getTime();
};

/**
 * 跳起来
 *
 * 使得指定的玩家跳起来
 *
 * @param {int} playerIndex
 * @return {void}
 */
GameModel.jump = function(playerIndex) {
    GameModel._verify(playerIndex);
    if (GameModel.players[playerIndex].jump) {
        return;
    }
    GameModel.players[playerIndex].jump = true;
    GameModel.players[playerIndex].jumpTime = (new Date()).getTime();
    GameModel.players[playerIndex].jumpSpeed = GameModel.players[playerIndex].jumpSpeedMax;
};

/**
 * 攻击
 *
 * 使得指定的玩家出拳
 *
 * @param {int} playerIndex
 * @return {void}
 */
GameModel.hit = function(playerIndex) {
    GameModel._verify(playerIndex);
    if (GameModel.players[playerIndex].hitKeep > 0) {
        return;
    }
    const time = (new Date()).getTime();
    GameModel.players[playerIndex].hitStatus = true;
    GameModel.players[playerIndex].hitStart = time;
    GameModel.players[playerIndex].hitEndTime = time + GameModel.players[playerIndex].hitContinue;
    GameModel.players[playerIndex].hitKeep = GameModel.players[playerIndex].hitKeepMax;
};

/**
 * 格挡
 *
 * 使得指定的玩家格挡
 *
 * @param {int} playerIndex
 * @return {void}
 */
GameModel.shelter = function(playerIndex) {
    GameModel._verify(playerIndex);
    if (GameModel.players[playerIndex].shelterKeep > 0) {
        return;
    }
    const time = (new Date()).getTime();
    GameModel.players[playerIndex].shelterStatus = true;
    GameModel.players[playerIndex].shelterStart = time;
    GameModel.players[playerIndex].shelterKeep = GameModel.players[playerIndex].shelterKeepMax;
};

/**
 * 验证玩家参数合法性
 *
 * 用于验证传入的玩家参数是不是存在
 * 不存在时抛出错误
 *
 * @param {int} playerIndex
 * @return {void}
 */
GameModel._verify = function(playerIndex) {
    if ('undefined' == typeof(GameModel.players[playerIndex])) {
        throw ('player not exists.');
    }
};
