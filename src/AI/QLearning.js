/**
 * Q学习算法
 *
 * 强化学习是无导师学习算法，不需要外部指定学习信号，只需把环境信号传进来就行。
 * 运作流程：外部通过调用QLearning.data()方法传入环境数据，然后通过
 * QLearning.result()读取数据就行了。算法会自动根据上一次传入的数据进行时间差分
 * 操作。
 *
 * 这个文件是针对拳皇游戏写的，里面的格式化操作和奖赏函数不能直接用于其它的环境
 *
 */
const QLearning = new Object();

QLearning.saTable = new Object(); // SA 表
QLearning.inputLength = 16; // 外面传进来的输入的长度
QLearning.precision = 5; // 量化精度
QLearning.outputLength = 5; // 输出值长度

QLearning.s = null; // 状态（保存的是hash字符串）
QLearning.sk = 0; // action的key
QLearning.sp = null; // 下一个状态（保存的是hash字符串）
QLearning.spk = 0; // action的key
QLearning.alpha = 0.5; // 学习速度
QLearning.gamma = 0.5; // 控制长期占比的伽玛值
QLearning.reward = 0; // 奖赏信号
QLearning.action = new Array(0,0,0,0,0); // 计算结果，将被result()方法返回的数据

/**
 * 由外部环境调用data()前设置，设置奖赏值
 *
 * 实际上设置的是agent的输出导致的变化产生的奖赏值
 *
 * @param {number} reward 奖赏值
 * @return {void}
 */
QLearning.setReward = function(reward) {
    QLearning.reward = reward;
};

/**
 * 设置环境信号
 *
 * @param {array} input 1维数组，拳皇游戏给agent的环境信号
 * @return {void}
 */
QLearning.data = function(input) {

    QLearning.s = QLearning.sp;
    QLearning.sk = QLearning.spk;

    const sphash = QLearning._stateHash(input);
    if ('undefined' == typeof(QLearning.saTable[sphash])) {
        QLearning.saTable[sphash] = QLearning._activRandom(QLearning.outputLength);
    }

    // 计算这个输入值长期回报最好的输出值，得到结果。
    let act = QLearning.saTable[sphash];
    let maxKey = 0;
    for (let i = 0; i < QLearning.outputLength; i++) {
        if (act[i] > act[maxKey]) {
            maxKey = i;
        }
    }
    let action = new Array(QLearning.outputLength);
    for (let i = 0; i < QLearning.outputLength; i++) {
        action[i] = 0;
    }
    action[maxKey] = 1;

    QLearning.action = action;

    QLearning.sp = sphash;
    QLearning.spk = maxKey;

    // 更新
    if (null !== QLearning.s && null !== QLearning.sp) {
        QLearning.saTable[QLearning.s][QLearning.sk] = (1 - QLearning.alpha) * QLearning.saTable[QLearning.s][QLearning.sk]
            + QLearning.alpha * (QLearning.reward + QLearning.gamma * QLearning.saTable[QLearning.sp][QLearning.spk]);
    }
    
};

/**
 * 返回agent的动作
 *
 * @return {array} 符合拳皇游戏需求的控制信号
 */
QLearning.result = function() {
    return QLearning.action;
};

/**
 * 按照一定的规则对输入值进行采样量化，返回一个字符串
 *
 * @param {array} state 输入的数组
 * @return {string} 采样量化后的hash
 */
QLearning._stateHash = function(state) {
    let step1 = new Array();
    for (let i = 0; i < QLearning.inputLength; i++) {
        if (state[i] < 0) {
            step1.push(0);
        } else if (state[i] > 1) {
            step1.push(1);
        } else {
            step1.push(state[i]);
        }
    }

    let step2 = new Array();
    for (let i = 0; i < QLearning.inputLength; i++) {
        step2.push(parseInt(step1[i] * QLearning.precision));
    }

    let result = 'h';
    for (let i = 0; i < QLearning.inputLength; i++) {
        result += step2[i];
    }
    return result;
};

/**
 * 返回随机数组
 *
 * @param {int} len 长度
 * @return {array}
 */
QLearning._activRandom = function(len) {
    let res = new Array();
    for (let o = 0; o < len; o++) {
        res.push(Math.random());
    }
    return res;
};
