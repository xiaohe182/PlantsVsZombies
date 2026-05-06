/**
 * 渲染模块
 * 棋盘渲染、卡片渲染、实体渲染、界面刷新
 */
(function () {
  /**
   * 刷新界面
   */
  function renderGame(state) {
    window.GameUI.updateHeaderPanel(state);
    window.GameUI.updateSelectionText(state);
    window.GameUI.updateMessageText(state);
    renderCardPanel(state);
    renderGrid(state);
    renderEntities(state);
  }

  /**
   * 渲染卡片
   */
  function renderCardPanel(state) {
    const cardPanel = document.getElementById("card-panel");
    const plantKeys = Object.keys(window.GameConfig.PLANT_CONFIG);
    const cardHtml = plantKeys.map(function (plantType) {
      return createCardHtml(state, plantType);
    }).join("");

    cardPanel.innerHTML = cardHtml + createShovelHtml(state);
  }

  /**
   * 渲染棋盘
   */
  function renderGrid(state) {
    const gridLayer = document.getElementById("grid-layer");
    gridLayer.innerHTML = state.grid.cells.map(function (cell) {
      return createCellHtml(state, cell);
    }).join("");
  }

  /**
   * 渲染实体
   */
  function renderEntities(state) {
    const entityLayer = document.getElementById("entity-layer");
    const html = [
      renderPlants(state),
      renderZombies(state),
      renderProjectiles(state),
      renderSuns(state)
    ].join("");

    entityLayer.innerHTML = html;
  }

  /**
   * 渲染植物
   */
  function renderPlants(state) {
    return state.plants.map(function (plant) {
      const styleText = getEntityStyle(plant.row, plant.col, 88, 88);
      const assetPath = getPlantAssetPath(plant.type);
      return '<div class="entity-item plant-item float-idle" data-plant-type="' + plant.type + '" style="' + styleText + '">' + createAssetImage(assetPath, plant.name, "entity-art") + "</div>";
    }).join("");
  }

  /**
   * 渲染僵尸
   */
  function renderZombies(state) {
    return state.zombies.map(function (zombie) {
      const styleText = getEntityStyle(zombie.row, zombie.col, 70, 96);
      return '<div class="entity-item zombie-item" data-zombie-type="' + zombie.type + '" style="' + styleText + '">' + zombie.label + "</div>";
    }).join("");
  }

  /**
   * 渲染子弹
   */
  function renderProjectiles(state) {
    return state.projectiles.map(function (projectile) {
      const styleText = getEntityStyle(projectile.row, projectile.col, 22, 22);
      const assetPath = "./assets/images/projectiles/pea.svg";
      return '<div class="entity-item projectile-item" style="' + styleText + '">' + createAssetImage(assetPath, "豌豆", "projectile-art") + "</div>";
    }).join("");
  }

  /**
   * 渲染阳光
   */
  function renderSuns(state) {
    return state.suns.map(function (sun) {
      const styleText = getEntityStyle(sun.row, sun.col, 56, 56);
      const assetPath = "./assets/images/ui/sun.svg";
      return '<button class="entity-item sun-item float-idle" type="button" data-role="sun-item" data-sun-id="' + sun.id + '" style="' + styleText + '">' + createAssetImage(assetPath, "阳光", "sun-art") + "</button>";
    }).join("");
  }

  /**
   * 生成卡片结构
   */
  function createCardHtml(state, plantType) {
    const plantConfig = window.GameConfig.PLANT_CONFIG[plantType];
    const cooldown = state.cards.cooldowns[plantType];
    const isActive = state.selection.plantType === plantType && !state.selection.shovelMode;
    const isDisabled = cooldown > 0 || state.resources.sun < plantConfig.cost;
    const classNames = ["plant-card"];

    if (isActive) {
      classNames.push("is-active");
    }

    if (cooldown > 0) {
      classNames.push("is-cooling");
    }

    if (isDisabled) {
      classNames.push("is-disabled");
    }

    return [
      '<button class="' + classNames.join(" ") + '" type="button" data-role="plant-card" data-plant-type="' + plantType + '">',
      '<span class="card-art-wrap">' + createAssetImage(getPlantAssetPath(plantType), plantConfig.name, "card-art") + "</span>",
      '<span class="card-cost">' + plantConfig.cost + "</span>",
      '<span class="card-cooldown"></span>',
      "</button>"
    ].join("");
  }

  /**
   * 生成铲子结构
   */
  function createShovelHtml(state) {
    const classText = state.selection.shovelMode ? "is-active" : "";
    return [
      '<button id="shovel-button" class="' + classText + '" type="button" data-role="shovel">',
      '<span class="card-art-wrap card-art-text">铲</span>',
      "</button>"
    ].join("");
  }

  /**
   * 生成格子结构
   */
  function createCellHtml(state, cell) {
    const classNames = ["grid-cell", "is-hoverable"];
    if (state.selection.plantType && cell.plantId === "") {
      classNames.push("is-can-plant");
    }

    return '<button class="' + classNames.join(" ") + '" type="button" data-role="grid-cell" data-row="' + cell.row + '" data-col="' + cell.col + '"></button>';
  }

  /**
   * 生成实体样式
   */
  function getEntityStyle(row, col, width, height) {
    const boardSize = getBoardSize();
    const cellWidth = boardSize.width / window.GameConfig.GAME_CONFIG.boardCols;
    const cellHeight = boardSize.height / window.GameConfig.GAME_CONFIG.boardRows;
    const left = col * cellWidth + (cellWidth - width) / 2;
    const top = row * cellHeight + (cellHeight - height) / 2;

    return "left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;";
  }

  /**
   * 读取棋盘尺寸
   */
  function getBoardSize() {
    const gridLayer = document.getElementById("grid-layer");
    const fallbackWidth = window.GameConfig.GAME_CONFIG.boardWidth;
    const fallbackHeight = window.GameConfig.GAME_CONFIG.boardHeight;

    if (!gridLayer) {
      return { width: fallbackWidth, height: fallbackHeight };
    }

    return {
      width: gridLayer.clientWidth || fallbackWidth,
      height: gridLayer.clientHeight || fallbackHeight
    };
  }

  /**
   * 读取植物资源
   */
  function getPlantAssetPath(plantType) {
    return "./assets/images/plants/" + plantType + ".svg";
  }

  /**
   * 生成图片结构
   */
  function createAssetImage(assetPath, altText, className) {
    return '<img class="' + className + '" src="' + assetPath + '" alt="' + altText + '">';
  }

  window.GameRender = {
    renderGame
  };
})();
