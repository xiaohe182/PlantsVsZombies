/**
 * 关卡模块
 * 波次开始、关卡更新、胜负检查
 */
(function () {
  /**
   * 开始波次
   */
  function startLevel(state) {
    state.level.currentWave = 1;
  }

  /**
   * 更新关卡
   */
  function updateLevel() {
    return;
  }

  /**
   * 检查胜负
   */
  function checkGameResult() {
    return "running";
  }

  window.GameLevel = {
    startLevel,
    updateLevel,
    checkGameResult
  };
})();
