/**
 * AI模块
 *
 * 每间隔一段时间，就从GameModel那里获取游戏数据进行计算，然后调用GameModel的
 * 方法控制玩家1的动作。
 *
 * @return {void}
 */
const AI = new Object();

/**
 * webworker
 *
 * Webworker对象
 *
 */
AI.worker = null;

/**
 * 下次发送的间隔
 *
 * 接收到线程的消息后，隔多少毫秒再次向线程发送消息
 *
 */
AI.sleepTime = 50;

/**
 * 模块初始化
 *
 * 初始化并开始AI运作
 *
 * @return {void}
 */
AI.init = function() {
    AI.worker = new Worker('src/WorkerProcess.js');
    AI.worker.onmessage = AI.messageHandle;
    AI.sendMessage();
};

/**
 * 发送消息
 *
 * 整合当前玩家的信息，发送给AI算法。
 *
 * @return {void}
 */
AI.sendMessage = function() {
    if ('string' == typeof(window.localStorage.getItem('ai'))) {
        AI.worker.postMessage(window.localStorage.getItem('ai'));
    }
    var input = new Array();
    for (var i = 0; i < GameModel.players.length; i++) {
        input.push(Math.abs(GameModel.players[i].x) / GameModel.width); // 玩家的水平位置
        input.push(Math.abs(GameModel.height - GameModel.players[i].y) / GameModel.height); // 玩家的垂直位置
        input.push(GameModel.players[i].face == 'right' ? 1 : 0); // 玩家的朝向
        input.push(GameModel.players[i].blood / GameModel.players[i].bloodMax); // 玩家的血量
        input.push(GameModel.players[i].shelterKeep / GameModel.players[i].shelterKeepMax); // E技能的冷却时间
        input.push(GameModel.players[i].hitKeep / GameModel.players[i].hitKeepMax); // E技能的冷却时间
        input.push(GameModel.players[i].beAttackEnable ? 1 : 0); // 玩家是否可以被攻击shelterStatus
        input.push(GameModel.players[i].shelterStatus ? 1 : 0); // 玩家是否处于格挡状态
    }

    AI.worker.postMessage(input);
};

/**
 * 接收并处理线程的消息
 *
 * 根据线程发送回来的消息调用GameModel的方法。
 *
 * @return {void}
 */
AI.messageHandle = function(event) {
    if ('string' == typeof(event.data)) {
        window.localStorage.setItem('ai', event.data);
        return;
    }
    const sign = event.data;
    if (sign[0] == 1) {
        GameModel.left(1);
    }
    if (sign[1] == 1) {
        GameModel.right(1);
    }
    if (sign[2] == 1) {
        GameModel.jump(1);
    }
    if (sign[3] == 1) {
        GameModel.shelter(1);
    }
    if (sign[4] == 1) {
        GameModel.hit(1);
    }
    setTimeout(AI.sendMessage, AI.sleepTime);
};

