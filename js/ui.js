/**
 * 界面模块
 * 面板更新、提示文本、选择文本、弹层显示
 */
(function () {
  /**
   * 更新头部面板
   */
  function updateHeaderPanel(state) {
    setText("sun-count", String(state.resources.sun));
    setText("wave-count", state.level.currentWave + " / " + state.level.totalWaves);
    setText("game-status", window.GameUtils.getStatusText(state.meta.status));
  }

  /**
   * 更新选择文本
   */
  function updateSelectionText(state) {
    const selectedText = getSelectionText(state);
    setText("selected-text", selectedText);
  }

  /**
   * 更新提示文本
   */
  function updateMessageText(state) {
    setText("message-text", state.ui.message);
  }

  /**
   * 显示结果弹层
   */
  function showResultModal(title, text) {
    setText("modal-title", title);
    setText("modal-text", text);
    toggleClass("modal-layer", "is-hidden", false);
  }

  /**
   * 隐藏结果弹层
   */
  function hideResultModal() {
    toggleClass("modal-layer", "is-hidden", true);
  }

  /**
   * 读取选择文本
   */
  function getSelectionText(state) {
    if (state.selection.shovelMode) {
      return "铲子";
    }

    if (!state.selection.plantType) {
      return "未选择";
    }

    const plantConfig = window.GameConfig.PLANT_CONFIG[state.selection.plantType];
    return plantConfig ? plantConfig.name : "未选择";
  }

  /**
   * 设置文本
   */
  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * 切换类名
   */
  function toggleClass(id, className, force) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.toggle(className, force);
    }
  }

  window.GameUI = {
    updateHeaderPanel,
    updateSelectionText,
    updateMessageText,
    showResultModal,
    hideResultModal
  };
})();
