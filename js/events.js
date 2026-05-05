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
    bindModalEvents();
    isBound = true;
  }

  /**
   * 绑定卡片事件
   */
  function bindCardEvents() {
    const cardPanel = document.getElementById("card-panel");
    cardPanel.addEventListener("click", handleCardPanelClick);
  }

  /**
   * 绑定格子事件
   */
  function bindGridEvents() {
    const gridLayer = document.getElementById("grid-layer");
    gridLayer.addEventListener("click", handleGridClick);
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
   * 绑定弹层事件
   */
  function bindModalEvents() {
    document.getElementById("modal-restart-button").addEventListener("click", window.GameMain.restartGame);
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

    window.GameState.setSelection(plantType, false);
    window.GameState.setMessage("已选择 " + plantConfig.name + "。");
    window.GameRender.renderGame(state);
  }

  /**
   * 处理铲子选择
   */
  function handleShovelClick() {
    const state = window.GameState.getGameState();
    window.GameState.setSelection("", true);
    window.GameState.setMessage("已选择铲子。");
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

    if (state.selection.shovelMode) {
      removePlantAtCell(state, row, col);
      return;
    }

    if (!state.selection.plantType) {
      window.GameState.setMessage("请先选择植物卡片。");
      window.GameRender.renderGame(state);
      return;
    }

    plantSeedAtCell(state, row, col, state.selection.plantType);
  }

  /**
   * 铲除植物
   */
  function removePlantAtCell(state, row, col) {
    const removed = window.GamePlants.removePlant(state, row, col);
    const message = removed ? "植物已移除。" : "当前格子没有植物。";

    window.GameState.setMessage(message);
    window.GameRender.renderGame(state);
  }

  /**
   * 种植植物
   */
  function plantSeedAtCell(state, row, col, plantType) {
    const planted = window.GamePlants.plantSeed(state, row, col, plantType);
    const plantConfig = window.GameConfig.PLANT_CONFIG[plantType];
    const message = planted ? plantConfig.name + " 已种植。" : "当前格子无法种植或阳光不足。";

    window.GameState.setMessage(message);
    window.GameRender.renderGame(state);
  }

  window.GameEvents = {
    bindGameEvents,
    handleCardClick,
    handleShovelClick,
    handleGridClick
  };
})();
