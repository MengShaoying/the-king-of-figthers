/**
 * 游戏内抽象数据刷新模块
 *
 * 此模块每间隔一段时间就会刷新GameModel的游戏数据，功能是依据物理规则改变物体
 * 速度和物体属性。
 *
 * @return {void}
 */
const Timer = new Object();

/**
 * 间隔
 *
 * 刷新的时间间隔，单位是毫秒。不是精确时间，这个是用setTimeout()方法去设定的。
 *
 */
Timer.flushTime = 1;

/**
 * setTimeout()方法的返回值
 *
 * 假如这个值不为null的话，会先用clearTimeout()清除，然后再用setTimeout()去设定
 *
 */
Timer.timeoutHandle = null;

/**
 * 当前时间戳
 *
 * 每次间隔开始计算新的位移时，先刷新这个时间戳
 *
 */
Timer.time = (new Date()).getTime();

/**
 * 模块初始化
 *
 * 开始刷新
 *
 * @return {void}
 */
Timer.init = function() {
    Timer.run();
};

/**
 * setTimeout()的定时事件
 *
 * 清除旧的setTimeout()，然后执行刷新逻辑，接着setTimeout()等待下次刷讯。
 *
 * @return {void}
 */
Timer.run = function() {
    if (null !== Timer.timeout) {
        clearTimeout(Timer.timeout);
    }
    Timer.flushProcess();
    Timer.timeout = setTimeout(Timer.run, Timer.flushTime);
};

/**
 * 刷新逻辑
 *
 * 此方法处理游戏模型的数据更新操作
 *
 * @return {void}
 */
Timer.flushProcess = function() {
    Timer.time = (new Date()).getTime();
    for (let i = 0; i < GameModel.players.length; i++) {
        Timer.xMove(GameModel.players[i]);
        Timer.yMove(GameModel.players[i]);
        Timer.attack(GameModel.players[i]);
        Timer.shelter(GameModel.players[i]);
    }
    Timer.attackJudge();
    for (let i = 0; i < GameModel.players.length; i++) {
        if (GameModel.players[i].blood <= 0) {
            Timer.gameover();
        }
    }
};

/**
 * 处理玩家的左右移动速度数据
 *
 * @param {Object} player 玩家对象
 * @return {void}
 */
Timer.xMove = function(player) {
    if (player.speed > 0) {
        if (player.x < 0) {
            player.x = 0;
            return;
        }
        if (player.x > GameModel.width) {
            player.x = GameModel.width;
            return;
        }
        const time = Timer.time;
        const x = (time - player.moveStart) * player.speed;
        if (player.face == 'right') {
            player.x += x;
        } else {
            player.x -= x;
        }
        player.speed -= (time - player.moveStart) * player.deSpeed;
        if (player.speed <= 0) {
            player.speed = 0;
        }
        player.moveStart = time;
    }
};

/**
 * 处理玩家的跳跃速度数据
 *
 * @param {Object} player 玩家对象
 * @return {void}
 */
Timer.yMove = function(player) {
    if (player.jump) {
        const time = Timer.time;
        const x = (time - player.jumpTime) * player.jumpSpeed; // 大于0表示向上移动，小于0表示向下，速度本身可以小于0
        player.y -= x;
        player.jumpSpeed -= (time - player.jumpTime) * player.jumpSpeedA;
        player.jumpTime = time;
        if (player.y >= GameModel.height) {
            player.jump = false;
            player.y = GameModel.height
        }
    }
};

/**
 * 处理玩家的攻击技能数据
 *
 * @param {Object} player 玩家对象
 * @return {void}
 */
Timer.attack = function(player) {
    if (player.hitStatus) {
        if (Timer.time >= player.hitEndTime) {
            player.hitStatus = false;
        }
    }
    if (player.hitKeep > 0) {
        player.hitKeep = player.hitStart + player.hitKeepMax - Timer.time;
        if (player.hitKeep <= 0) {
            player.hitKeep = 0;
        }
    }
    if (player.beAttackEnable == false) {
        if (player.beAttackTime + player.beAttackEnableTime < Timer.time) {
            player.beAttackEnable = true;
        }
    }
};

/**
 * 处理玩家的格挡数据
 *
 * @param {Object} player 玩家对象
 * @return {void}
 */
Timer.shelter = function(player) {
    if (player.shelterStatus) {
        if (Timer.time >= player.shelterStart + player.shelterTime) {
            player.shelterStatus = false;
        }
    }
    if (player.shelterKeep > 0) {
        player.shelterKeep = player.shelterStart + player.shelterKeepMax - Timer.time;
        if (player.shelterKeep <= 0) {
            player.shelterKeep = 0;
        }
    }
};

/**
 * 攻击判定
 *
 * 遍历所有玩家，将在玩家攻击范围内的玩家给予被攻击状态标记，并扣除血量
 *
 * @return {void}
 */
Timer.attackJudge = function() {
    for (let i = 0; i < GameModel.players.length; i++) {
        if (GameModel.players[i].hitStatus) {
            // 查找被这名玩家攻击到的玩家，并扣除它们的血量
            for (let j = 0; j < GameModel.players.length; j++) {
                if (i == j) { // 排除自己
                    continue;
                }
                if (GameModel.players[i].face == 'left') { // 排除在背后的
                    if (GameModel.players[j].x >= GameModel.players[i].x) {
                        continue;
                    }
                } else {
                    if (GameModel.players[j].x <= GameModel.players[i].x) {
                        continue;
                    }
                }
                if (
                    Math.abs(GameModel.players[j].x - GameModel.players[i].x) < GameModel.attackLength &&
                    GameModel.players[j].y >= GameModel.players[i].y &&
                    GameModel.players[j].y - GameModel.players[i].y <= GameModel.attackHeight &&
                    GameModel.players[j].beAttackEnable == true &&
                    GameModel.players[j].shelterStatus == false
                ) {
                    GameModel.players[j].beAttackTime = Timer.time;
                    GameModel.players[j].blood -= GameModel.players[i].hitAttack;
                    GameModel.players[j].beAttackEnable = false;
                    if (GameModel.players[j].blood <= 0) {
                        GameModel.players[j].blood = 0;
                    }
                }
            }
        }
    }
    // 取消所有在被攻击状态中的玩家的攻击状态
    for (let i = 0; i < GameModel.players.length; i++) {
        if (Timer.time - GameModel.players[i].beAttackTime <= GameModel.players[i].beAttackContinue) {
            GameModel.players[i].hitStatus = false;
        }
    }
};

/**
 * 攻击判定
 *
 * 遍历所有玩家，将在玩家攻击范围内的玩家给予被攻击状态标记，并扣除血量
 *
 * @return {void}
 */
Timer.gameover = function() {
    window.location.reload();
};
