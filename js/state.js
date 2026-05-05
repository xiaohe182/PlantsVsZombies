/**
 * 状态模块
 * 初始状态、状态重置、状态读取
 */
(function () {
  let gameState = null;

  /**
   * 创建初始状态
   */
  function createInitialState() {
    return {
      meta: {
        status: "ready",
        started: false,
        lastTickTime: 0
      },
      resources: {
        sun: window.GameConfig.GAME_CONFIG.startSun
      },
      selection: {
        plantType: "",
        shovelMode: false
      },
      grid: {
        rows: window.GameConfig.GAME_CONFIG.boardRows,
        cols: window.GameConfig.GAME_CONFIG.boardCols,
        cells: []
      },
      plants: [],
      zombies: [],
      projectiles: [],
      suns: [],
      level: {
        currentWave: 0,
        totalWaves: window.GameConfig.LEVEL_CONFIG.totalWaves
      },
      ui: {
        message: "点击开始按钮，进入骨架调试状态。",
        selectedText: "未选择"
      }
    };
  }

  /**
   * 重置状态
   */
  function resetGameState() {
    gameState = createInitialState();
    return gameState;
  }

  /**
   * 读取状态
   */
  function getGameState() {
    if (!gameState) {
      gameState = createInitialState();
    }

    return gameState;
  }

  /**
   * 设置状态
   */
  function setGameStatus(status) {
    const state = getGameState();
    state.meta.status = status;
    state.meta.started = status !== "ready";
  }

  /**
   * 设置提示
   */
  function setMessage(message) {
    const state = getGameState();
    state.ui.message = message;
  }

  /**
   * 设置选择
   */
  function setSelection(plantType, shovelMode) {
    const state = getGameState();
    state.selection.plantType = plantType;
    state.selection.shovelMode = shovelMode;
    state.ui.selectedText = shovelMode ? "铲子" : plantType || "未选择";
  }

  window.GameState = {
    createInitialState,
    resetGameState,
    getGameState,
    setGameStatus,
    setMessage,
    setSelection
  };
})();
