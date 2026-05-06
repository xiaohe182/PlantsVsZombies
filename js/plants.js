/**
 * 植物模块
 * 植物创建、种植植物、铲除植物、植物更新
 */
(function () {
  /**
   * 创建植物
   */
  function createPlant(row, col, plantType) {
    const plantConfig = window.GameConfig.PLANT_CONFIG[plantType];

    return {
      id: window.GameUtils.createId("plant"),
      row,
      col,
      type: plantType,
      name: plantConfig.name,
      label: plantConfig.label,
      hp: plantConfig.hp,
      actionTimer: 0
    };
  }

  /**
   * 种植植物
   */
  function plantSeed(state, row, col, plantType) {
    const plantConfig = window.GameConfig.PLANT_CONFIG[plantType];
    if (!plantConfig) {
      return false;
    }

    if (!window.GameGrid.canPlantAtCell(state, row, col)) {
      return false;
    }

    if (state.resources.sun < plantConfig.cost) {
      return false;
    }

    if (state.cards.cooldowns[plantType] > 0) {
      return false;
    }

    const plant = createPlant(row, col, plantType);
    state.resources.sun -= plantConfig.cost;
    state.plants.push(plant);
    window.GameGrid.setPlantAtCell(state, row, col, plant.id);
    window.GameState.setCardCooldown(state, plantType, plantConfig.cooldown);
    return true;
  }

  /**
   * 铲除植物
   */
  function removePlant(state, row, col) {
    const plant = window.GameGrid.getPlantAtCell(state, row, col);
    if (!plant) {
      return false;
    }

    state.plants = window.GameUtils.removeItemById(state.plants, plant.id);
    window.GameGrid.setPlantAtCell(state, row, col, "");
    return true;
  }

  /**
   * 植物受伤
   */
  function damagePlant(state, plantId, damage) {
    const plant = window.GameUtils.findItemById(state.plants, plantId);
    if (!plant) {
      return false;
    }

    plant.hp -= damage;
    if (plant.hp > 0) {
      return false;
    }

    removePlant(state, plant.row, plant.col);
    return true;
  }

  /**
   * 更新植物
   */
  function updatePlants(state, deltaTime) {
    window.GameState.reduceCardCooldowns(state, deltaTime);
    state.plants.forEach(function (plant) {
      plant.actionTimer += deltaTime;
      updatePlantAction(state, plant);
    });
  }

  /**
   * 更新植物行为
   */
  function updatePlantAction(state, plant) {
    if (plant.type === "sunflower") {
      updateSunflower(state, plant);
      return;
    }

    if (plant.type === "peashooter") {
      updatePeashooter(state, plant);
    }
  }

  /**
   * 生成阳光
   */
  function updateSunflower(state, plant) {
    const produceInterval = window.GameConfig.PLANT_CONFIG.sunflower.produceInterval;
    if (plant.actionTimer < produceInterval) {
      return;
    }

    plant.actionTimer = 0;
    window.GameSun.spawnSun(state, plant.row - 0.08, plant.col + 0.02, "plant");
  }

  /**
   * 发射子弹
   */
  function updatePeashooter(state, plant) {
    const attackInterval = window.GameConfig.PLANT_CONFIG.peashooter.attackInterval;
    if (!hasZombieAhead(state, plant)) {
      plant.actionTimer = Math.min(plant.actionTimer, attackInterval);
      return;
    }

    if (plant.actionTimer < attackInterval) {
      return;
    }

    plant.actionTimer = 0;
    window.GameProjectiles.spawnProjectile(state, plant.row, plant.col + 0.58, plant.type);
  }

  /**
   * 检查前方僵尸
   */
  function hasZombieAhead(state, plant) {
    return state.zombies.some(function (zombie) {
      return zombie.row === plant.row && zombie.col > plant.col + 0.18;
    });
  }

  window.GamePlants = {
    createPlant,
    plantSeed,
    removePlant,
    damagePlant,
    updatePlants
  };
})();
