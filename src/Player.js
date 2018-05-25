/**
 * 游戏玩家对象
 *
 * 保存一个游戏人物，数据和相关的方法
 *
 * @return {void}
 */
const Player = function() {
    this.blood = 100; // 生命值
    this.bloodMax = 100; // 最大生命值
    this.hitAttack = 5; // 攻击对方一下，对方损失多少生命值
    this.beAttackEnable = true; // 是否可以被攻击
    this.beAttackTime = 0; // 被攻击的时间
    this.beAttackContinue = 200; // 被攻击状态持续的时间，在被攻击状态内，玩家不能攻击其它玩家，也不会再被任何玩家攻击
    this.beAttackEnableTime = 500; // 再次进入可以被攻击的状态的时间

    this.x = 0; // 人物距离屏幕左侧的距离
    this.y = 0; // 人物脚底距离屏幕顶端的距离

    this.face = 'right'; // 人物正脸的朝向
    this.speedMove = 1.2; // 下达移动指令的时候，人物的初始速度
    this.speed = 0; // 人物的移动速度，单位是像素每毫秒
    this.moveStart = 0; // 时间戳，单位是毫秒
    this.deSpeed = 0.005; // 每隔1毫秒移动速度降低多少

    this.jumpTime = 0; // 起跳时间戳
    this.jump = false; // 是否处于跳跃状态
    this.jumpSpeedMax = 2; // 起跳速度
    this.jumpSpeed = 0; // 空中速度，只是垂直方向的速度，不包括水平方向，向上为正
    this.jumpSpeedA = 0.005;// 跳跃中的加速度，取值是非负自然数，每秒向下加多少速度

    this.hitStatus = false; // 是否处于攻击状态
    this.hitStart = 0; // 攻击开始时的时间戳
    this.hitContinue = 500; // 攻击持续时间
    this.hitEndTime = 0; // 攻击停止时间戳
    this.hitKeep = 0; // 攻击剩余冷却时间
    this.hitKeepMax = 1000; // 攻击冷却时间

    this.shelterStatus = false; // 是否处于格挡状态
    this.shelterStart = 0; // 格挡动作开始的时间戳
    this.shelterTime = 500; // 格挡动作持续时间
    this.shelterKeep = 0; // 格挡冷却时间，剩余毫秒数
    this.shelterKeepMax = 2000; // 格挡冷却时间，毫秒数
};
