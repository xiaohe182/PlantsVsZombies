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
    window.GameState.setGameStatus("running");
    window.GameState.setMessage("骨架循环已启动，后续接入战斗逻辑。");

    if (state.level.currentWave === 0) {
      window.GameLevel.startLevel(state);
    }

    window.GameRender.renderGame(state);
  }

  /**
   * 暂停游戏
   */
  function pauseGame() {
    const state = window.GameState.getGameState();
    const nextStatus = state.meta.status === "paused" ? "running" : "paused";
    const message = nextStatus === "paused" ? "游戏已暂停。" : "游戏已继续。";

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
