/**
 * 格子模块
 * 格子创建、格子查询、种植校验
 */
(function () {
  /**
   * 创建格子数据
   */
  function createGridCells(rows, cols) {
    const cells = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        cells.push({
          key: getCellKey(row, col),
          row,
          col,
          plantId: ""
        });
      }
    }

    return cells;
  }

  /**
   * 获取格子键
   */
  function getCellKey(row, col) {
    return row + "-" + col;
  }

  /**
   * 查询格子
   */
  function findCell(state, row, col) {
    const cellKey = getCellKey(row, col);

    return state.grid.cells.find(function (cell) {
      return cell.key === cellKey;
    }) || null;
  }

  /**
   * 查询植物
   */
  function getPlantAtCell(state, row, col) {
    return state.plants.find(function (plant) {
      return plant.row === row && plant.col === col;
    }) || null;
  }

  /**
   * 检查种植位置
   */
  function canPlantAtCell(state, row, col) {
    const cell = findCell(state, row, col);
    if (!cell) {
      return false;
    }

    return !getPlantAtCell(state, row, col);
  }

  /**
   * 记录植物占位
   */
  function setPlantAtCell(state, row, col, plantId) {
    const cell = findCell(state, row, col);
    if (!cell) {
      return;
    }

    cell.plantId = plantId;
  }

  window.GameGrid = {
    createGridCells,
    getCellKey,
    findCell,
    getPlantAtCell,
    canPlantAtCell,
    setPlantAtCell
  };
})();
