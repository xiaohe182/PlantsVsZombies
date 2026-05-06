/**
 * 阳光模块
 * 阳光生成、阳光收集、阳光更新
 */
(function () {
  /**
   * 生成阳光
   */
  function spawnSun(state, row, col, sourceType) {
    const sun = {
      id: window.GameUtils.createId("sun"),
      row,
      col,
      sourceType: sourceType || "sky",
      value: window.GameConfig.GAME_CONFIG.sunValue,
      lifeTime: window.GameConfig.GAME_CONFIG.sunLifetime
    };

    state.suns.push(sun);
    return sun;
  }

  /**
   * 收集阳光
   */
  function collectSun(state, sunId) {
    const sun = window.GameUtils.findItemById(state.suns, sunId);
    if (!sun) {
      return false;
    }

    state.suns = window.GameUtils.removeItemById(state.suns, sunId);
    state.resources.sun += sun.value;
    return true;
  }

  /**
   * 更新阳光
   */
  function updateSuns(state, deltaTime) {
    updateNaturalSun(state, deltaTime);
    updateSunLifetime(state, deltaTime);
  }

  /**
   * 自然掉落
   */
  function updateNaturalSun(state, deltaTime) {
    state.meta.elapsedTime += deltaTime;
    if (state.meta.elapsedTime < window.GameConfig.GAME_CONFIG.naturalSunInterval) {
      return;
    }

    state.meta.elapsedTime = 0;
    spawnSun(state, randomRow(), randomCol(), "sky");
  }

  /**
   * 更新阳光寿命
   */
  function updateSunLifetime(state, deltaTime) {
    state.suns = state.suns.filter(function (sun) {
      sun.lifeTime -= deltaTime;
      return sun.lifeTime > 0;
    });
  }

  /**
   * 随机行数
   */
  function randomRow() {
    return Number((Math.random() * 4.2 + 0.2).toFixed(2));
  }

  /**
   * 随机列数
   */
  function randomCol() {
    return Number((Math.random() * 6 + 1.1).toFixed(2));
  }

  window.GameSun = {
    spawnSun,
    collectSun,
    updateSuns
  };
})();
