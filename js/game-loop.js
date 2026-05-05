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
    state.meta.lastTickTime = timestamp;

    if (state.meta.status === "running") {
      window.GamePlants.updatePlants(state);
      window.GameZombies.updateZombies(state);
      window.GameProjectiles.updateProjectiles(state);
      window.GameSun.updateSuns(state);
      window.GameLevel.updateLevel(state);
    }

    window.GameRender.renderGame(state);
    frameId = requestAnimationFrame(tick);
  }

  window.GameLoop = {
    startLoop,
    stopLoop,
    tick
  };
})();
