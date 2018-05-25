importScripts('AI/QLearning.js');
/**
 * Webworker线程
 *
 * 处理AI计算
 *
 */
const WorkerProcess = new Object();

/**
 * 临时保存处理结果
 *
 * 计算结果保存在这个属性上，调用send将发送这个值给页面。
 * 控制信号：左，右，跳，e，r，共5个布尔信号
 *
 */
WorkerProcess.result = new Array(0,0,0,0,0);

/**
 * 获取计算结果之后，间隔多久才向页面发送
 *
 * 立即发送的话，CPU占用太高了
 *
 */
WorkerProcess.delaySend = 50;

/**
 * 上一次的输入和上一次的输出值
 *
 */
WorkerProcess.lastInfo = {'input':[],'output':[]};

/**
 * 初始化模块
 *
 * 绑定事件
 *
 * @return {void}
 */
WorkerProcess.init = function() {
    onmessage = function(event) {
        if ('string' == typeof(event.data)) {
            QLearning.saTable = JSON.parse(event.data);
            return;
        }
        WorkerProcess.result = WorkerProcess.getRespond(event.data);
        setTimeout(WorkerProcess.send, WorkerProcess.delaySend);
    };
};

/**
 * 向页面发送信息
 *
 * 将result属性发送出去
 *
 * @return {void}
 */
WorkerProcess.send = function() {
    postMessage(JSON.stringify(QLearning.saTable));
    postMessage(WorkerProcess.result);
};

/**
 * 主要计算过程
 *
 * 将result属性发送出去
 *
 * @param {array} input 一个数组，取值在[0,1]范围
 * @return {array} 作为待发送给页面的控制信号
 */
WorkerProcess.getRespond = function(input) {
    let reward = 0.01;
    if (input[3] < WorkerProcess.lastInfo.input[3]) {
        reward += 2;
    }
    if (input[3+8] < WorkerProcess.lastInfo.input[3+8]) {
        reward -= 2;
    }
    if (input[3] == 0) {
        reward += 1000;
    }
    if (input[3+8] == 0) {
        reward -= 1000;
    }

    QLearning.setReward(reward);
    QLearning.data(input);

    let result = QLearning.result();

    for (let i = 0; i < input.length; i++) {
        WorkerProcess.lastInfo.input[i] = input[i];
    }
    for (let i = 0; i < result.length; i++) {
        WorkerProcess.lastInfo.output[i] = result[i];
    }
    return result;
};

/**
 * 模块初始化
 */
WorkerProcess.init();

