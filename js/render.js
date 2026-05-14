/**
 * 渲染模块（性能优化版）
 * 卡片/格子：字符串缓存比对，仅在内容变化时刷新 innerHTML
 * 实体：持久化 DOM，diff 增删，每帧只更新 style 属性
 */
(function () {
  var cachedCards = "";
  var cachedGrid = "";
  var entityEls = {};

  /**
   * 刷新界面
   */
  function renderGame(state) {
    window.GameUI.updateHeaderPanel(state);
    window.GameUI.updateSelectionText(state);
    window.GameUI.updateMessageText(state);

    var newCards = buildCardPanelHtml(state);
    if (newCards !== cachedCards) {
      document.getElementById("card-panel").innerHTML = newCards;
      cachedCards = newCards;
    }

    var newGrid = buildGridHtml(state);
    if (newGrid !== cachedGrid) {
      document.getElementById("grid-layer").innerHTML = newGrid;
      cachedGrid = newGrid;
    }

    syncEntities(state);
  }

  /**
   * 清除缓存（重启时调用）
   */
  function clearCache() {
    var keys = Object.keys(entityEls);
    for (var i = 0; i < keys.length; i++) {
      entityEls[keys[i]].remove();
    }
    entityEls = {};
    cachedCards = "";
    cachedGrid = "";
  }

  /* ───── 实体同步 ───── */

  function syncEntities(state) {
    var layer = document.getElementById("entity-layer");
    var alive = {};

    syncProjectiles(state.projectiles, layer, alive);
    syncPlants(state.plants, layer, alive);
    syncZombies(state.zombies, layer, alive);
    syncSuns(state.suns, layer, alive);

    var keys = Object.keys(entityEls);
    for (var i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      if (!alive[key]) {
        entityEls[key].remove();
        delete entityEls[key];
      }
    }
  }

  function syncProjectiles(projectiles, layer, alive) {
    var size = getEntitySize("projectile");
    var asset = "./assets/images/projectiles/pea.svg";

    for (var pi = 0; pi < projectiles.length; pi++) {
      var p = projectiles[pi];

      var key = "p-" + p.id;
      alive[key] = true;
      var el = entityEls[key];
      if (!el) {
        el = document.createElement("div");
        el.className = "entity-item projectile-item";
        el.innerHTML = '<img class="projectile-art" src="' + asset + '" alt="豌豆">';
        layer.appendChild(el);
        entityEls[key] = el;
      }
      applyPos(el, p.row, p.col, size, size);

      for (var i = 1; i <= 3; i++) {
        var opacity = 0.45 - i * 0.13;
        if (opacity <= 0) {
          break;
        }
        var tKey = "pt-" + p.id + "-" + i;
        alive[tKey] = true;
        var tEl = entityEls[tKey];
        if (!tEl) {
          tEl = document.createElement("div");
          tEl.className = "entity-item projectile-item projectile-trail";
          tEl.innerHTML = '<img class="projectile-art" src="' + asset + '" alt="">';
          layer.appendChild(tEl);
          entityEls[tKey] = tEl;
        }
        var tSize = size * (1 - i * 0.12);
        applyPos(tEl, p.row, p.col - i * 0.2, tSize, tSize);
        tEl.style.opacity = opacity.toFixed(2);
      }
    }
  }

  function syncPlants(plants, layer, alive) {
    var size = getEntitySize("plant");

    for (var i = 0; i < plants.length; i++) {
      var plant = plants[i];
      var key = "pl-" + plant.id;
      alive[key] = true;
      var el = entityEls[key];
      if (!el) {
        var assetPath = "./assets/images/plants/" + plant.type + ".svg";
        el = document.createElement("div");
        el.className = "entity-item plant-item anim-plant-" + plant.type;
        el.innerHTML = '<img class="entity-art" src="' + assetPath + '" alt="' + plant.name + '">';
        layer.appendChild(el);
        entityEls[key] = el;
      }
      applyPos(el, plant.row, plant.col, size, size);
    }
  }

  function syncZombies(zombies, layer, alive) {
    var size = getEntitySize("zombie");
    var height = size * 1.37;

    for (var i = 0; i < zombies.length; i++) {
      var zombie = zombies[i];
      var key = "z-" + zombie.id;
      alive[key] = true;
      var el = entityEls[key];
      if (!el) {
        var assetPath = "./assets/images/zombies/" + zombie.type + ".svg";
        el = document.createElement("div");
        el.className = "entity-item zombie-item";
        el.innerHTML = '<img class="zombie-art" src="' + assetPath + '" alt="' + zombie.name + '">';
        layer.appendChild(el);
        entityEls[key] = el;
      }
      var animClass = zombie.isAttacking ? "anim-zombie-eat" : "anim-zombie-walk";
      var fullClass = "entity-item zombie-item " + animClass;
      if (el.className !== fullClass) {
        el.className = fullClass;
      }
      applyPos(el, zombie.row, zombie.col, size, height);
    }
  }

  function syncSuns(suns, layer, alive) {
    var size = getEntitySize("sun");

    for (var i = 0; i < suns.length; i++) {
      var sun = suns[i];
      var key = "s-" + sun.id;
      alive[key] = true;
      var el = entityEls[key];
      if (!el) {
        var assetPath = "./assets/images/ui/sun.svg";
        el = document.createElement("button");
        el.className = "entity-item sun-item float-idle";
        el.type = "button";
        el.setAttribute("data-role", "sun-item");
        el.innerHTML = '<img class="sun-art" src="' + assetPath + '" alt="阳光">';
        layer.appendChild(el);
        entityEls[key] = el;
      }
      el.setAttribute("data-sun-id", sun.id);
      applyPos(el, sun.row, sun.col, size, size);
    }
  }

  /**
   * 更新实体位置（只改 style 属性，不重建 DOM）
   */
  function applyPos(el, row, col, width, height) {
    var board = getBoardSize();
    var cellW = board.width / window.GameConfig.GAME_CONFIG.boardCols;
    var cellH = board.height / window.GameConfig.GAME_CONFIG.boardRows;
    el.style.left = (col * cellW + (cellW - width) / 2) + "px";
    el.style.top = (row * cellH + (cellH - height) / 2) + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";
  }

  /* ───── 卡片 / 格子 HTML 构建 ───── */

  function buildCardPanelHtml(state) {
    var keys = Object.keys(window.GameConfig.PLANT_CONFIG);
    var html = "";
    for (var i = 0; i < keys.length; i++) {
      html += createCardHtml(state, keys[i]);
    }
    return html + createShovelHtml(state);
  }

  function buildGridHtml(state) {
    var cells = state.grid.cells;
    var html = "";
    for (var i = 0; i < cells.length; i++) {
      html += createCellHtml(state, cells[i]);
    }
    return html;
  }

  function createCardHtml(state, plantType) {
    var plantConfig = window.GameConfig.PLANT_CONFIG[plantType];
    var cooldown = state.cards.cooldowns[plantType];
    var isActive = state.selection.plantType === plantType && !state.selection.shovelMode;
    var isDisabled = cooldown > 0 || state.resources.sun < plantConfig.cost;
    var classNames = ["plant-card"];

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
      '<button class="', classNames.join(" "), '" type="button" data-role="plant-card" data-plant-type="', plantType, '">',
      '<span class="card-art-wrap">', createAssetImage("./assets/images/plants/" + plantType + ".svg", plantConfig.name, "card-art"), "</span>",
      '<span class="card-cost">', plantConfig.cost, "</span>",
      '<span class="card-cooldown"></span>',
      "</button>"
    ].join("");
  }

  function createShovelHtml(state) {
    var cls = state.selection.shovelMode ? "is-active" : "";
    return [
      '<button id="shovel-button" class="', cls, '" type="button" data-role="shovel">',
      '<span class="card-art-wrap card-art-text">铲</span>',
      "</button>"
    ].join("");
  }

  function createCellHtml(state, cell) {
    var classNames = ["grid-cell", "is-hoverable"];

    if (state.selection.plantType && cell.plantId === "") {
      classNames.push("is-can-plant");
    }

    if (state.ui.hoverRow === cell.row && state.ui.hoverCol === cell.col) {
      if (state.selection.plantType && cell.plantId === "") {
        classNames.push("is-drag-hover");
      } else if (state.selection.shovelMode && cell.plantId !== "") {
        classNames.push("is-shovel-hover");
      } else if (state.selection.shovelMode) {
        classNames.push("is-drag-hover");
      }
    }

    return '<button class="' + classNames.join(" ") + '" type="button" data-role="grid-cell" data-row="' + cell.row + '" data-col="' + cell.col + '"></button>';
  }

  /* ───── 工具函数 ───── */

  function getEntitySize(type) {
    var root = document.documentElement;
    var sizeMap = {
      plant: "--entity-plant-size",
      zombie: "--entity-zombie-size",
      projectile: "--entity-projectile-size",
      sun: "--entity-sun-size"
    };
    var cssVar = sizeMap[type];
    if (cssVar) {
      var value = getComputedStyle(root).getPropertyValue(cssVar).trim();
      if (value) {
        return parseFloat(value);
      }
    }
    var fallback = { plant: 88, zombie: 70, projectile: 22, sun: 56 };
    return fallback[type] || 50;
  }

  function getBoardSize() {
    var grid = document.getElementById("grid-layer");
    var fw = window.GameConfig.GAME_CONFIG.boardWidth;
    var fh = window.GameConfig.GAME_CONFIG.boardHeight;
    if (!grid) {
      return { width: fw, height: fh };
    }
    return {
      width: grid.clientWidth || fw,
      height: grid.clientHeight || fh
    };
  }

  function createAssetImage(assetPath, altText, className) {
    return '<img class="' + className + '" src="' + assetPath + '" alt="' + altText + '">';
  }

  window.GameRender = {
    renderGame: renderGame,
    clearCache: clearCache
  };
})();
