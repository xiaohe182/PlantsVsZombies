/**
 * 子弹模块
 * 子弹创建、子弹发射、子弹更新
 */
(function () {
  /**
   * 创建子弹
   */
  function createProjectile(row, col, plantType) {
    const plantConfig = window.GameConfig.PLANT_CONFIG[plantType] || {};

    return {
      id: window.GameUtils.createId("projectile"),
      row,
      col,
      type: plantType,
      damage: plantConfig.damage || 20,
      speed: window.GameConfig.GAME_CONFIG.projectileSpeed,
      label: "豆"
    };
  }

  /**
   * 发射子弹
   */
  function spawnProjectile(state, row, col, plantType) {
    const projectile = createProjectile(row, col, plantType);
    state.projectiles.push(projectile);
    return projectile;
  }

  /**
   * 更新子弹
   */
  function updateProjectiles(state, deltaTime) {
    const nextProjectiles = [];
    state.projectiles.forEach(function (projectile) {
      projectile.col += projectile.speed * (deltaTime / 1000);
      if (tryHitZombie(state, projectile)) {
        return;
      }

      if (projectile.col <= window.GameConfig.GAME_CONFIG.boardCols + 0.8) {
        nextProjectiles.push(projectile);
      }
    });
    state.projectiles = nextProjectiles;
  }

  /**
   * 命中僵尸
   */
  function tryHitZombie(state, projectile) {
    const zombie = findHitZombie(state, projectile);
    if (!zombie) {
      return false;
    }

    window.GameZombies.damageZombie(state, zombie.id, projectile.damage);
    return true;
  }

  /**
   * 查询命中目标
   */
  function findHitZombie(state, projectile) {
    return state.zombies.find(function (zombie) {
      const hitRange = window.GameConfig.GAME_CONFIG.projectileHitRange;
      const distance = Math.abs(zombie.col - projectile.col);
      return zombie.row === projectile.row && distance <= hitRange;
    }) || null;
  }

  window.GameProjectiles = {
    createProjectile,
    spawnProjectile,
    updateProjectiles
  };
})();
