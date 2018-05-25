/**
 * 动画效果
 *
 * 对页面中的所有img标签进行赋予动画功能。需要对img标签添加一系列的data属性。
 * acs 动作的名称
 * ac 每个动作对应的循环图片
 * actime 每个动作图片播放的时间间隔，毫秒
 * acstatus 当前播放的动过名称
 * 该模块还会对img添加一些额外的属性以方便模块功能的实现，属性都以ac开头。
 *
 * 备注：动画是循环播放的。通过修改元素的acstatus属性可以控制播放的动作。可以
 * 动态地往页面添加img标签，每个出现在页面的img标签都会被处理。
 *
 */
const Animation = new Object();

/**
 * 初始化模块
 *
 * 初始化模块，设置模块并开始运作
 *
 * @return {void}
 */
Animation.init = function() {
    requestAnimationFrame(Animation.run);
};

/**
 * 刷新逻辑
 *
 * 更新全部img的背景
 *
 * @return {void}
 */
Animation.flushProcess = function() {
    const images = document.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
        Animation.oneImg(images[i]);
    }
};

/**
 * 处理一个img的图片变换
 *
 * 更新指定img元素的背景
 *
 * @param {element} img 元素对象
 * @return {void}
 */
Animation.oneImg = function(img) {
    const config = Animation.getConfig(img);
    if (false === config) {
        return;
    }
    Animation.complete(img);
    const statusConfig = Animation.getConfigByStatus(config.acstatus, img);
    if (false === statusConfig) {
        return;
    }
    if (config.acstatus != img.dataset.aclastname) {
        img.src = statusConfig.ac[0];
        img.setAttribute('data-aclastname', config.acstatus);
        img.setAttribute('data-acindex', 0);
        img.setAttribute('data-acupdate', (new Date()).getTime());
    } else {
        const now = (new Date()).getTime();
        const diff = now - img.dataset.acupdate;
        const cycle = statusConfig.actime * statusConfig.ac.length;
        const pass = parseInt((diff % cycle) / statusConfig.actime);
        const index = (parseInt(img.dataset.acindex) + pass) % statusConfig.ac.length;

        if (index != img.dataset.acindex) {
            img.src = statusConfig.ac[index];
            img.setAttribute('data-acindex', index);
            img.setAttribute('data-acupdate', now);
        }
    }
};

/**
 * 获取img标签的属性配置
 *
 * @param {element} img 元素对象
 * @return {Object|boolean} 配置正确，则返回一个对象，不正确返回false
 */
Animation.getConfig = function(img) {
    let allDefined = ('undefined' != typeof (img.dataset.acs)) &&
        ('undefined' != typeof (img.dataset.ac)) &&
        ('undefined' != typeof (img.dataset.actime)) &&
        ('undefined' != typeof (img.dataset.acstatus));

    if (!allDefined) {
        return false;
    }

    let result = new Object();
    try {
        result.acs = JSON.parse(img.dataset.acs.replace(/\'/g,'"'));
        result.ac = JSON.parse(img.dataset.ac.replace(/\'/g,'"'));
        result.actime = JSON.parse(img.dataset.actime.replace(/\'/g,'"'));
        result.acstatus = img.dataset.acstatus;
    } catch (e) {
        result = false;
    }
    return result;
};

/**
 * 初始化所有需要的配置参数
 *
 * 除了配置基本的参数外，img标签上也需要一些使功能完整运作的其它属性
 *
 * @param {element} img 元素对象
 * @return {void}
 */
Animation.complete = function(img) {
    let complete = ('undefined' != typeof (img.dataset.aclastname)) &&
        ('undefined' != typeof (img.dataset.acupdate));
    if (!complete) {
        img.setAttribute('data-aclastname', img.dataset.acstatus);
        img.setAttribute('data-acupdate', (new Date()).getTime());
        img.setAttribute('data-acindex', 0);
    }
};

/**
 * 根据指定的动作名称，返回动作的图片数组和图片切换延迟时间
 *
 * 假如指定的动作名称不存在，返回false
 *
 * @param {string} status 动作名称
 * @param {element} img 元素对象
 * @return {Object|boolean}
 */
Animation.getConfigByStatus = function(status, img) {
    const acs = JSON.parse(img.dataset.acs.replace(/\'/g,'"'));
    const ac = JSON.parse(img.dataset.ac.replace(/\'/g,'"'));
    const actime = JSON.parse(img.dataset.actime.replace(/\'/g,'"'));

    for (let i = 0; i < acs.length; i++) {
        if (acs[i] == status) {
            return {ac:ac[i], actime:actime[i]};
        }
    }
    return false;
};

/**
 * setTimeout()的定时事件
 *
 * 清除旧的setTimeout()，然后执行刷新逻辑，接着setTimeout()等待下次刷讯。
 *
 * @return {void}
 */
Animation.run = function() {
    Animation.flushProcess();
    requestAnimationFrame(Animation.run);
};
