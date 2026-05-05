/**
 * 子弹模块
 * 子弹创建、子弹发射、子弹更新
 */
(function () {
  /**
   * 创建子弹
   */
  function createProjectile(row, col) {
    return {
      id: window.GameUtils.createId("projectile"),
      row,
      col,
      label: "豆"
    };
  }

  /**
   * 发射子弹
   */
  function spawnProjectile(state, row, col) {
    const projectile = createProjectile(row, col);
    state.projectiles.push(projectile);
    return projectile;
  }

  /**
   * 更新子弹
   */
  function updateProjectiles() {
    return;
  }

  window.GameProjectiles = {
    createProjectile,
    spawnProjectile,
    updateProjectiles
  };
})();
