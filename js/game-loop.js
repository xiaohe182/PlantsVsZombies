/**
 * 主循环模块
 * 循环启动、循环停止、逐帧更新
 */
(function () {
  let frameId = 0;

  /**
   * 启动循环
   */
  function startLoop() {
    stopLoop();
    frameId = requestAnimationFrame(tick);
  }

  /**
   * 停止循环
   */
  function stopLoop() {
    if (!frameId) {
      return;
    }

    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  /**
   * 逐帧更新
   */
  function tick(timestamp) {
    const state = window.GameState.getGameState();
    updateTime(state, timestamp);

    if (state.meta.status === "running") {
      runUpdates(state);
    }

    window.GameRender.renderGame(state);
    frameId = requestAnimationFrame(tick);
  }

  /**
   * 更新时间
   */
  function updateTime(state, timestamp) {
    const lastTick = state.meta.lastTickTime || timestamp;
    state.meta.deltaTime = timestamp - lastTick;
    state.meta.lastTickTime = timestamp;
  }

  /**
   * 执行更新
   */
  function runUpdates(state) {
    const deltaTime = state.meta.deltaTime;
    window.GamePlants.updatePlants(state, deltaTime);
    window.GameZombies.updateZombies(state, deltaTime);
    window.GameProjectiles.updateProjectiles(state, deltaTime);
    window.GameSun.updateSuns(state, deltaTime);
    window.GameLevel.updateLevel(state, deltaTime);
  }

  window.GameLoop = {
    startLoop,
    stopLoop,
    tick
  };
})();
