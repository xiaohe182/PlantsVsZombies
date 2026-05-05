/**
 * 配置模块
 * 棋盘参数、植物参数、僵尸参数、关卡参数
 */
(function () {
  const GAME_CONFIG = Object.freeze({
    boardRows: 5,
    boardCols: 9,
    boardWidth: 972,
    boardHeight: 600,
    startSun: 150,
    tickInterval: 1000 / 60,
    statusTextMap: {
      ready: "未开始",
      running: "进行中",
      paused: "已暂停",
      victory: "胜利",
      defeat: "失败"
    }
  });

  const PLANT_CONFIG = Object.freeze({
    sunflower: {
      type: "sunflower",
      name: "向日葵",
      cost: 50,
      label: "花",
      cooldown: 7500
    },
    peashooter: {
      type: "peashooter",
      name: "豌豆射手",
      cost: 100,
      label: "豆",
      cooldown: 7500
    },
    wallnut: {
      type: "wallnut",
      name: "坚果墙",
      cost: 50,
      label: "坚",
      cooldown: 15000
    }
  });

  const ZOMBIE_CONFIG = Object.freeze({
    normal: {
      type: "normal",
      name: "普通僵尸",
      label: "僵"
    },
    cone: {
      type: "cone",
      name: "路障僵尸",
      label: "障"
    }
  });

  const LEVEL_CONFIG = Object.freeze({
    totalWaves: 3,
    zombieCount: 0
  });

  window.GameConfig = {
    GAME_CONFIG,
    PLANT_CONFIG,
    ZOMBIE_CONFIG,
    LEVEL_CONFIG
  };
})();
