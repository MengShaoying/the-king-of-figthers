/**
 * UI刷新模块
 *
 * 此模块每间隔一段时间就会刷新界面
 *
 * @return {void}
 */
const Ui = new Object();

/**
 * 模块初始化
 *
 * 开始刷新
 *
 * @return {void}
 */
Ui.init = function() {
    document.getElementById('game').style.width = window.innerWidth + 'px';
    document.getElementById('game').style.height = window.innerHeight + 'px';
    document.getElementById('blood').style.left = window.innerWidth * 0.2 + 'px';
    document.getElementById('blood').style.width = window.innerWidth * 0.6 + 'px';
    const bloods = document.getElementsByClassName('value');
    for (let i = 0; i < bloods.length; i++) {
        bloods[i].style.width = parseInt(window.innerWidth * 0.6) / 2 - 50 + 'px';
    }
    const skl = document.getElementsByClassName('skl');
    for (let i = 0; i < skl.length; i++) {
        skl[i].style.width = parseInt(window.innerWidth * 0.6) / 2 - 14.5 + 'px';
    }
    document.getElementById('game').style.display = 'block';
    requestAnimationFrame(Ui.run);
};

/**
 * setTimeout()的定时事件
 *
 * 清除旧的setTimeout()，然后执行刷新逻辑，接着setTimeout()等待下次刷讯。
 *
 * @return {void}
 */
Ui.run = function() {
    Ui.flushProcess();
    requestAnimationFrame(Ui.run);
};

/**
 * 刷新逻辑
 *
 * 此方法处理UI更新操作
 *
 * @return {void}
 */
Ui.flushProcess = function() {
    Ui.draw('p0', GameModel.players[0]);
    Ui.draw('p1', GameModel.players[1]);
};

/**
 * 绘制角色
 *
 * 将角色的数据绘制到指定的id上面
 *
 * @param {string} id 元素的id
 * @param {Object} data player对象
 * @return {void}
 */
Ui.draw = function(id, data) {
    const div = document.getElementById(id);
    const hand = document.getElementById(id+'hand');
    const foot = document.getElementById(id+'foot');
    const body = document.getElementById(id+'body');
    const bloodNumber = document.getElementById('player'+id);
    const bloodColor = document.getElementById('bld'+id);
    const skillE = document.getElementById(id+'e');
    const skillR = document.getElementById(id+'r');
    div.style.top = data.y + 'px';
    div.style.left = data.x + 'px';
    if (data.face == 'left') {
        div.style.transform = 'scaleX(-1)';
    } else {
        div.style.transform = 'scaleX(1)';
    }
    if (data.speed > 0) {
        foot.dataset.acstatus = 'move';
    } else {
        foot.dataset.acstatus = 'normal';
    }
    if (data.hitStatus) {
        hand.dataset.acstatus = 'attack';
    } else {
        hand.dataset.acstatus = 'normal';
    }
    if (data.shelterStatus) {
        body.dataset.acstatus = 'shelter';
    } else if ((new Date()).getTime() - data.beAttackTime < data.beAttackContinue) {
        body.dataset.acstatus = 'beattack';
    } else {
        body.dataset.acstatus = 'normal';
    }
    if (bloodNumber.innerText != data.blood) {
        bloodNumber.innerText = data.blood;
    }
    bloodColor.style.width = (data.blood*100/data.bloodMax)+'%';
    if (data.shelterKeep > 0) {
        skillE.innerText = (data.shelterKeep / 1000).toFixed(1);
    } else {
        skillE.innerText = '';
    }
    if (data.hitKeep > 0) {
        skillR.innerText = (data.hitKeep / 1000).toFixed(1);
    } else {
        skillR.innerText = '';
    }
    // 绘制冷却缩减的扇形图
    Ui.drawKeep(id+'eh', data.shelterKeep / data.shelterKeepMax);
    Ui.drawKeep(id+'rh', data.hitKeep / data.hitKeepMax);
};

/**
 * 绘制扇形图
 *
 * @param {string} id 元素的id
 * @param {Object} data player对象
 * @return {void}
 */
Ui.drawKeep = function(id, num) {
    try {
        const element = document.getElementById(id).contentDocument.getElementById('polygon');
        const r = 15;
        const rota = num * 2 * Math.PI;
        let result = r+','+r;
        // 弧度坐标转笛卡尔坐标
        for (let i = 0; i < rota; i += 0.1) {
            result += (' '+(r+r*Math.sin(i))+','+(r-r*Math.cos(i)));
        }
        element.setAttribute('points', result);
    } catch (e) {
        return;
    }
};
