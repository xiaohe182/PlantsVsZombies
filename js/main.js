/**
 * 入口模块
 * 游戏初始化、开始游戏、暂停游戏、重新开始
 */
(function () {
  /**
   * 初始化游戏
   */
  function bootstrapGame() {
    const state = window.GameState.resetGameState();
    state.grid.cells = window.GameGrid.createGridCells(state.grid.rows, state.grid.cols);
    window.GameUI.hideResultModal();
    window.GameRender.renderGame(state);
    window.GameEvents.bindGameEvents();
    window.GameLoop.startLoop();
  }

  /**
   * 开始游戏
   */
  function startGame() {
    const state = window.GameState.getGameState();
    if (state.meta.status === "victory" || state.meta.status === "defeat") {
      return;
    }

    window.GameState.setGameStatus("running");
    window.GameState.setMessage("战斗开始。守住三波僵尸。");
    if (!state.level.started) {
      window.GameLevel.startLevel(state);
    }

    window.GameRender.renderGame(state);
  }

  /**
   * 暂停游戏
   */
  function pauseGame() {
    const state = window.GameState.getGameState();
    if (state.meta.status === "victory" || state.meta.status === "defeat") {
      return;
    }

    if (state.meta.status === "ready") {
      startGame();
      return;
    }

    const nextStatus = state.meta.status === "paused" ? "running" : "paused";
    const message = nextStatus === "paused" ? "游戏已暂停。" : "战斗继续。";
    window.GameState.setGameStatus(nextStatus);
    window.GameState.setMessage(message);
    window.GameRender.renderGame(state);
  }

  /**
   * 重新开始
   */
  function restartGame() {
    bootstrapGame();
  }

  window.GameMain = {
    bootstrapGame,
    startGame,
    pauseGame,
    restartGame
  };

  document.addEventListener("DOMContentLoaded", bootstrapGame);
})();
