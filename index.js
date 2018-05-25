/**
 * 主函数
 *
 * 页面加载完成后执行的函数
 *
 * @return {void}
 *
 */
function main() {
    Keyborad.init();
    GameModel.init();
    Timer.init();
    Ui.init();
    Animation.init();
    AI.init();
}

/**
 * 绑定window.onload事件
 */
window.addEventListener('load', main);

