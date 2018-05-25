/**
 * 键盘模块
 *
 * 处理键盘事件，ER释放技能，左右是移动，上和空格是跳
 *
 * @return {void}
 */
const Keyborad = new Object();

/**
 * 初始化
 *
 * 初始化绑定键盘事件
 *
 * @return {void}
 */
Keyborad.init = function() {
    window.addEventListener('keydown', Keyborad.eventHandle);
};

/**
 * 具体键盘事件处理
 *
 * 将事件根据按键的不同，再调用不同的方法处理
 *
 * @return {void}
 */
Keyborad.eventHandle = function(e) {
    switch (e.keyCode) {
        case 37: // 左箭头
            Keyborad.left();
            break;
        case 39: // 右箭头
            Keyborad.right();
            break;
        case 38: // 上箭头
        case 32: // 空格键
            Keyborad.jump();
            break;
        case 82: // R键
            Keyborad.hit();
            break;
        case 69: // E键
            Keyborad.shelter();
            break;
    }
};

/**
 * 左转
 *
 * 左转
 *
 * @return {void}
 */
Keyborad.left = function() {
    GameModel.left(0);
};

/**
 * 右转
 *
 * 右转
 *
 * @return {void}
 */
Keyborad.right = function() {
    GameModel.right(0);
};

/**
 * 跳
 *
 * 跳起来
 *
 * @return {void}
 */
Keyborad.jump = function() {
    GameModel.jump(0);
};

/**
 * 打
 *
 * 出拳，打击
 *
 * @return {void}
 */
Keyborad.hit = function() {
    GameModel.hit(0);
};

/**
 * 格挡
 *
 * 格挡！
 *
 * @return {void}
 */
Keyborad.shelter = function() {
    GameModel.shelter(0);
};
