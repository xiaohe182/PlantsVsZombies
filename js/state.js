/**
 * 状态模块
 * 初始状态、状态重置、状态读取、状态更新
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
        lastTickTime: 0,
        deltaTime: 0,
        elapsedTime: 0
      },
      resources: {
        sun: window.GameConfig.GAME_CONFIG.startSun
      },
      selection: {
        plantType: "",
        shovelMode: false
      },
      cards: {
        cooldowns: createCardCooldowns()
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
        totalWaves: window.GameConfig.LEVEL_CONFIG.totalWaves,
        elapsedTime: 0,
        spawnQueue: [],
        started: false,
        completed: false
      },
      ui: {
        message: "点击开始按钮，开始战斗。",
        selectedText: "未选择",
        hoverRow: -1,
        hoverCol: -1
      }
    };
  }

  /**
   * 创建冷却表
   */
  function createCardCooldowns() {
    const cooldowns = {};
    Object.keys(window.GameConfig.PLANT_CONFIG).forEach(function (plantType) {
      cooldowns[plantType] = 0;
    });
    return cooldowns;
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
    getGameState().ui.message = message;
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

  /**
   * 扣减冷却
   */
  function reduceCardCooldowns(state, deltaTime) {
    Object.keys(state.cards.cooldowns).forEach(function (plantType) {
      const currentValue = state.cards.cooldowns[plantType];
      state.cards.cooldowns[plantType] = Math.max(0, currentValue - deltaTime);
    });
  }

  /**
   * 设置冷却
   */
  function setCardCooldown(state, plantType, cooldown) {
    state.cards.cooldowns[plantType] = cooldown;
  }

  window.GameState = {
    createInitialState,
    resetGameState,
    getGameState,
    setGameStatus,
    setMessage,
    setSelection,
    reduceCardCooldowns,
    setCardCooldown
  };
})();
