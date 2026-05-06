/**
 * 配置模块
 * 棋盘参数、植物参数、僵尸参数、关卡参数
 */
(function () {
  const GAME_CONFIG = Object.freeze({
    boardRows: 5,
    boardCols: 9,
    boardWidth: 1180,
    boardHeight: 760,
    startSun: 150,
    sunValue: 25,
    tickInterval: 1000 / 60,
    naturalSunInterval: 7000,
    sunLifetime: 9000,
    projectileSpeed: 3.6,
    projectileHitRange: 0.28,
    defeatOffset: -0.45,
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
      label: "花",
      cost: 50,
      cooldown: 5000,
      hp: 180,
      produceInterval: 9000
    },
    peashooter: {
      type: "peashooter",
      name: "豌豆射手",
      label: "豆",
      cost: 100,
      cooldown: 6500,
      hp: 180,
      attackInterval: 1400,
      damage: 20
    },
    wallnut: {
      type: "wallnut",
      name: "坚果墙",
      label: "坚",
      cost: 50,
      cooldown: 12000,
      hp: 820
    }
  });

  const ZOMBIE_CONFIG = Object.freeze({
    normal: {
      type: "normal",
      name: "普通僵尸",
      label: "僵",
      hp: 110,
      speed: 0.17,
      damage: 24,
      attackInterval: 1000
    },
    cone: {
      type: "cone",
      name: "路障僵尸",
      label: "障",
      hp: 220,
      speed: 0.145,
      damage: 28,
      attackInterval: 1000
    }
  });

  const LEVEL_CONFIG = Object.freeze({
    totalWaves: 3,
    waves: [
      {
        wave: 1,
        entries: [
          { at: 1500, lane: 2, type: "normal" },
          { at: 4500, lane: 0, type: "normal" },
          { at: 7000, lane: 4, type: "normal" }
        ]
      },
      {
        wave: 2,
        entries: [
          { at: 11500, lane: 1, type: "normal" },
          { at: 14500, lane: 3, type: "cone" },
          { at: 17500, lane: 2, type: "normal" }
        ]
      },
      {
        wave: 3,
        entries: [
          { at: 22500, lane: 4, type: "cone" },
          { at: 25500, lane: 0, type: "normal" },
          { at: 28500, lane: 2, type: "cone" },
          { at: 31500, lane: 3, type: "normal" }
        ]
      }
    ]
  });

  window.GameConfig = {
    GAME_CONFIG,
    PLANT_CONFIG,
    ZOMBIE_CONFIG,
    LEVEL_CONFIG
  };
})();
