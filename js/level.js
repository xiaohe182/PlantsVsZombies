/**
 * 关卡模块
 * 波次开始、关卡更新、胜负检查
 */
(function () {
  /**
   * 开始关卡
   */
  function startLevel(state) {
    state.level.currentWave = 1;
    state.level.started = true;
    state.level.completed = false;
    state.level.elapsedTime = 0;
    state.level.spawnQueue = buildSpawnQueue();
  }

  /**
   * 更新关卡
   */
  function updateLevel(state, deltaTime) {
    if (!state.level.started || state.meta.status !== "running") {
      return;
    }

    state.level.elapsedTime += deltaTime;
    spawnReadyZombies(state);
    updateWaveProgress(state);
    checkGameResult(state);
  }

  /**
   * 检查胜负
   */
  function checkGameResult(state) {
    if (state.meta.status === "defeat") {
      return "defeat";
    }

    if (state.level.spawnQueue.length > 0) {
      return "running";
    }

    if (state.zombies.length > 0) {
      return "running";
    }

    if (!state.level.completed) {
      state.level.completed = true;
      state.meta.status = "victory";
      window.GameUI.showResultModal("守住了庭院", "所有波次已经结束，战斗胜利。点击重新开始。");
    }

    return state.meta.status;
  }

  /**
   * 生成刷怪表
   */
  function buildSpawnQueue() {
    const queue = [];
    window.GameConfig.LEVEL_CONFIG.waves.forEach(function (waveConfig) {
      waveConfig.entries.forEach(function (entry) {
        queue.push({
          wave: waveConfig.wave,
          at: entry.at,
          lane: entry.lane,
          type: entry.type
        });
      });
    });
    return queue.sort(function (left, right) {
      return left.at - right.at;
    });
  }

  /**
   * 刷出可生成僵尸
   */
  function spawnReadyZombies(state) {
    while (state.level.spawnQueue.length > 0) {
      const nextEntry = state.level.spawnQueue[0];
      if (nextEntry.at > state.level.elapsedTime) {
        return;
      }

      window.GameZombies.spawnZombie(state, nextEntry.lane, nextEntry.type);
      state.level.currentWave = nextEntry.wave;
      state.level.spawnQueue.shift();
    }
  }

  /**
   * 更新波次显示
   */
  function updateWaveProgress(state) {
    if (state.level.spawnQueue.length === 0) {
      state.level.currentWave = state.level.totalWaves;
    }
  }

  window.GameLevel = {
    startLevel,
    updateLevel,
    checkGameResult
  };
})();
