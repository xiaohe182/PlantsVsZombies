/**
 * 阳光模块
 * 阳光生成、阳光收集、阳光更新
 */
(function () {
  /**
   * 生成阳光
   */
  function spawnSun(state, row, col) {
    const sun = {
      id: window.GameUtils.createId("sun"),
      row,
      col,
      label: "光"
    };

    state.suns.push(sun);
    return sun;
  }

  /**
   * 收集阳光
   */
  function collectSun(state, sunId) {
    state.suns = window.GameUtils.removeItemById(state.suns, sunId);
    state.resources.sun += 25;
  }

  /**
   * 更新阳光
   */
  function updateSuns() {
    return;
  }

  window.GameSun = {
    spawnSun,
    collectSun,
    updateSuns
  };
})();
