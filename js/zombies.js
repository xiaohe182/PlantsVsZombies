/**
 * 僵尸模块
 * 僵尸创建、刷出僵尸、僵尸更新、僵尸受伤
 */
(function () {
  /**
   * 创建僵尸
   */
  function createZombie(lane, zombieType) {
    const zombieConfig = window.GameConfig.ZOMBIE_CONFIG[zombieType];

    return {
      id: window.GameUtils.createId("zombie"),
      row: lane,
      lane,
      col: window.GameConfig.GAME_CONFIG.boardCols + 0.38,
      type: zombieType,
      name: zombieConfig.name,
      label: zombieConfig.label,
      hp: zombieConfig.hp,
      speed: zombieConfig.speed,
      damage: zombieConfig.damage,
      attackInterval: zombieConfig.attackInterval,
      attackTimer: 0
    };
  }

  /**
   * 刷出僵尸
   */
  function spawnZombie(state, lane, zombieType) {
    const zombie = createZombie(lane, zombieType);
    state.zombies.push(zombie);
    return zombie;
  }

  /**
   * 更新僵尸
   */
  function updateZombies(state, deltaTime) {
    state.zombies.forEach(function (zombie) {
      updateZombie(state, zombie, deltaTime);
    });
    removeDefeatedZombies(state);
  }

  /**
   * 僵尸受伤
   */
  function damageZombie(state, zombieId, damage) {
    const zombie = window.GameUtils.findItemById(state.zombies, zombieId);
    if (!zombie) {
      return false;
    }

    zombie.hp -= damage;
    return zombie.hp <= 0;
  }

  /**
   * 更新单个僵尸
   */
  function updateZombie(state, zombie, deltaTime) {
    const targetPlant = findPlantToAttack(state, zombie);
    if (targetPlant) {
      attackPlant(state, zombie, targetPlant, deltaTime);
      return;
    }

    moveZombie(state, zombie, deltaTime);
  }

  /**
   * 移动僵尸
   */
  function moveZombie(state, zombie, deltaTime) {
    zombie.isAttacking = false;
    zombie.col -= zombie.speed * (deltaTime / 1000);
    if (zombie.col < window.GameConfig.GAME_CONFIG.defeatOffset) {
      state.meta.status = "defeat";
      window.GameUI.showResultModal("防线失守", "有僵尸闯入了庭院。点击重新开始。");
    }
  }

  /**
   * 啃食植物
   */
  function attackPlant(state, zombie, plant, deltaTime) {
    zombie.isAttacking = true;
    zombie.attackTimer += deltaTime;
    zombie.col = Math.max(zombie.col, plant.col + 0.16);
    if (zombie.attackTimer < zombie.attackInterval) {
      return;
    }

    zombie.attackTimer = 0;
    window.GamePlants.damagePlant(state, plant.id, zombie.damage);
  }

  /**
   * 查询目标植物
   */
  function findPlantToAttack(state, zombie) {
    return state.plants.find(function (plant) {
      return plant.row === zombie.row && zombie.col <= plant.col + 0.22 && zombie.col >= plant.col - 0.65;
    }) || null;
  }

  /**
   * 清理死亡僵尸
   */
  function removeDefeatedZombies(state) {
    state.zombies = state.zombies.filter(function (zombie) {
      return zombie.hp > 0;
    });
  }

  window.GameZombies = {
    createZombie,
    spawnZombie,
    updateZombies,
    damageZombie
  };
})();
