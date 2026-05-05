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
      label: plantConfig.label
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

    const plant = createPlant(row, col, plantType);
    state.resources.sun -= plantConfig.cost;
    state.plants.push(plant);
    window.GameGrid.setPlantAtCell(state, row, col, plant.id);
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
   * 更新植物
   */
  function updatePlants() {
    return;
  }

  window.GamePlants = {
    createPlant,
    plantSeed,
    removePlant,
    updatePlants
  };
})();
