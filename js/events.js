/**
 * 事件模块
 * 事件绑定、卡片选择、格子点击、按钮点击
 */
(function () {
  let isBound = false;

  /**
   * 绑定事件
   */
  function bindGameEvents() {
    if (isBound) {
      return;
    }

    bindCardEvents();
    bindGridEvents();
    bindActionEvents();
    bindSunEvents();
    bindModalEvents();
    isBound = true;
  }

  /**
   * 绑定卡片事件
   */
  function bindCardEvents() {
    document.getElementById("card-panel").addEventListener("click", handleCardPanelClick);
  }

  /**
   * 绑定格子事件
   */
  function bindGridEvents() {
    document.getElementById("grid-layer").addEventListener("click", handleGridClick);
  }

  /**
   * 绑定操作事件
   */
  function bindActionEvents() {
    document.getElementById("start-button").addEventListener("click", window.GameMain.startGame);
    document.getElementById("pause-button").addEventListener("click", window.GameMain.pauseGame);
    document.getElementById("restart-button").addEventListener("click", window.GameMain.restartGame);
  }

  /**
   * 绑定阳光事件
   */
  function bindSunEvents() {
    document.getElementById("entity-layer").addEventListener("click", handleEntityClick);
  }

  /**
   * 绑定弹层事件
   */
  function bindModalEvents() {
    document.getElementById("modal-restart-button").addEventListener("click", window.GameMain.restartGame);
  }

  /**
   * 处理实体点击
   */
  function handleEntityClick(event) {
    const target = event.target.closest("[data-role='sun-item']");
    if (!target) {
      return;
    }

    const state = window.GameState.getGameState();
    window.GameSun.collectSun(state, target.dataset.sunId || "");
    window.GameRender.renderGame(state);
  }

  /**
   * 处理卡槽点击
   */
  function handleCardPanelClick(event) {
    const target = event.target.closest("button");
    if (!target) {
      return;
    }

    if (target.dataset.role === "shovel") {
      handleShovelClick();
      return;
    }

    handleCardClick(target.dataset.plantType || "");
  }

  /**
   * 处理卡片选择
   */
  function handleCardClick(plantType) {
    const state = window.GameState.getGameState();
    const plantConfig = window.GameConfig.PLANT_CONFIG[plantType];
    if (!plantConfig) {
      return;
    }

    if (state.cards.cooldowns[plantType] > 0) {
      window.GameState.setMessage("植物冷却中。");
      window.GameRender.renderGame(state);
      return;
    }

    if (state.resources.sun < plantConfig.cost) {
      window.GameState.setMessage("阳光不足。");
      window.GameRender.renderGame(state);
      return;
    }

    window.GameState.setSelection(plantType, false);
    window.GameRender.renderGame(state);
  }

  /**
   * 处理铲子选择
   */
  function handleShovelClick() {
    const state = window.GameState.getGameState();
    window.GameState.setSelection("", true);
    window.GameRender.renderGame(state);
  }

  /**
   * 处理格子点击
   */
  function handleGridClick(event) {
    const target = event.target.closest("[data-role='grid-cell']");
    if (!target) {
      return;
    }

    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    const state = window.GameState.getGameState();

    if (state.meta.status !== "running") {
      window.GameMain.startGame();
    }

    if (state.selection.shovelMode) {
      removePlantAtCell(state, row, col);
      return;
    }

    if (!state.selection.plantType) {
      return;
    }

    plantSeedAtCell(state, row, col, state.selection.plantType);
  }

  /**
   * 铲除植物
   */
  function removePlantAtCell(state, row, col) {
    window.GamePlants.removePlant(state, row, col);
    window.GameRender.renderGame(state);
  }

  /**
   * 种植植物
   */
  function plantSeedAtCell(state, row, col, plantType) {
    const planted = window.GamePlants.plantSeed(state, row, col, plantType);
    if (planted) {
      window.GameState.setSelection("", false);
    }
    window.GameRender.renderGame(state);
  }

  window.GameEvents = {
    bindGameEvents,
    handleCardClick,
    handleShovelClick,
    handleGridClick
  };
})();
