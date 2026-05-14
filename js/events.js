/**
 * 事件模块
 * 事件绑定、卡片选择、拖拽种植、铲子跟随、格子交互
 */
(function () {
  let isBound = false;

  var dragState = {
    active: false,
    plantType: "",
    startX: 0,
    startY: 0
  };

  var DRAG_THRESHOLD = 5;

  /**
   * 绑定事件
   */
  function bindGameEvents() {
    if (isBound) {
      return;
    }

    bindCardEvents();
    bindGridEvents();
    bindActionEvents();
    bindSunEvents();
    bindModalEvents();
    bindGlobalEvents();
    isBound = true;
  }

  /**
   * 绑定卡片事件
   */
  function bindCardEvents() {
    document.getElementById("card-panel").addEventListener("mousedown", handleCardPanelMouseDown);
  }

  /**
   * 绑定格子事件
   */
  function bindGridEvents() {
    document.getElementById("grid-layer").addEventListener("mousedown", handleGridClick);
  }

  /**
   * 绑定操作事件
   */
  function bindActionEvents() {
    document.getElementById("start-button").addEventListener("mousedown", window.GameMain.startGame);
    document.getElementById("pause-button").addEventListener("mousedown", window.GameMain.pauseGame);
    document.getElementById("restart-button").addEventListener("mousedown", window.GameMain.restartGame);
  }

  /**
   * 绑定阳光事件
   */
  function bindSunEvents() {
    document.getElementById("entity-layer").addEventListener("mousedown", handleEntityClick);
  }

  /**
   * 绑定弹层事件
   */
  function bindModalEvents() {
    document.getElementById("modal-restart-button").addEventListener("mousedown", window.GameMain.restartGame);
  }

  /**
   * 绑定全局事件
   */
  function bindGlobalEvents() {
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
  }

  /* ───── 卡片处理 ───── */

  /**
   * 卡槽按下：选择 + 准备拖拽
   */
  function handleCardPanelMouseDown(event) {
    var target = event.target.closest("button");
    if (!target) {
      return;
    }

    if (target.dataset.role === "shovel") {
      handleShovelClick();
      return;
    }

    var plantType = target.dataset.plantType || "";
    handleCardClick(plantType);

    if (plantType && canAffordPlant(plantType)) {
      dragState.plantType = plantType;
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
    }
  }

  /**
   * 选择卡片
   */
  function handleCardClick(plantType) {
    var state = window.GameState.getGameState();
    var plantConfig = window.GameConfig.PLANT_CONFIG[plantType];
    if (!plantConfig) {
      return;
    }

    if (state.cards.cooldowns[plantType] > 0) {
      window.GameState.setMessage("植物冷却中。");
      window.GameRender.renderGame(state);
      return;
    }

    if (state.resources.sun < plantConfig.cost) {
      window.GameState.setMessage("阳光不足。");
      window.GameRender.renderGame(state);
      return;
    }

    window.GameState.setSelection(plantType, false);
    window.GameRender.renderGame(state);
  }

  /**
   * 选择铲子
   */
  function handleShovelClick() {
    var state = window.GameState.getGameState();
    window.GameState.setSelection("", true);
    window.GameRender.renderGame(state);
  }

  /* ───── 全局鼠标 ───── */

  /**
   * 全局鼠标移动：更新拖拽幽灵 / 铲子光标 / 悬停格子
   */
  function handleGlobalMouseMove(event) {
    updateShovelCursor(event.clientX, event.clientY);
    updateShovelHover(event);

    if (!dragState.plantType) {
      hideDragGhost();
      return;
    }

    var dx = event.clientX - dragState.startX;
    var dy = event.clientY - dragState.startY;

    if (!dragState.active && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
      dragState.active = true;
      document.body.classList.add("is-dragging");
    }

    if (dragState.active) {
      showDragGhost(event.clientX, event.clientY, dragState.plantType);
      updateDragHover(event.clientX, event.clientY);
    }
  }

  /**
   * 全局鼠标松开：完成拖拽种植
   */
  function handleGlobalMouseUp() {
    if (dragState.active) {
      var state = window.GameState.getGameState();
      var hoverRow = state.ui.hoverRow;
      var hoverCol = state.ui.hoverCol;

      if (hoverRow >= 0 && hoverCol >= 0 && dragState.plantType) {
        if (state.meta.status !== "running") {
          window.GameMain.startGame();
          state = window.GameState.getGameState();
        }
        plantSeedAtCell(state, hoverRow, hoverCol, dragState.plantType);
      }
    }

    dragState.active = false;
    dragState.plantType = "";
    hideDragGhost();
    clearHoverCell();
    document.body.classList.remove("is-dragging");
  }

  /**
   * ESC 键：取消铲子 / 拖拽
   */
  function handleKeyDown(event) {
    if (event.key !== "Escape") {
      return;
    }

    var state = window.GameState.getGameState();

    if (state.selection.shovelMode) {
      window.GameState.setSelection("", false);
      hideShovelCursor();
      window.GameRender.renderGame(state);
    }

    if (dragState.active) {
      dragState.active = false;
      dragState.plantType = "";
      hideDragGhost();
      clearHoverCell();
      document.body.classList.remove("is-dragging");
    }
  }

  /**
   * 右键：取消铲子 / 拖拽
   */
  function handleContextMenu(event) {
    event.preventDefault();

    var state = window.GameState.getGameState();

    if (state.selection.shovelMode) {
      window.GameState.setSelection("", false);
      hideShovelCursor();
      window.GameRender.renderGame(state);
    }

    if (dragState.active) {
      dragState.active = false;
      dragState.plantType = "";
      hideDragGhost();
      clearHoverCell();
      document.body.classList.remove("is-dragging");
    }
  }

  /* ───── 拖拽幽灵 ───── */

  function showDragGhost(clientX, clientY, plantType) {
    var ghost = document.getElementById("drag-ghost");
    if (!ghost) {
      ghost = document.createElement("div");
      ghost.id = "drag-ghost";
      ghost.className = "drag-ghost";
      document.getElementById("drag-layer").appendChild(ghost);
    }

    var assetPath = "./assets/images/plants/" + plantType + ".svg";
    var plantConfig = window.GameConfig.PLANT_CONFIG[plantType];
    ghost.innerHTML = '<img src="' + assetPath + '" alt="' + (plantConfig ? plantConfig.name : "") + '" class="ghost-art">';
    ghost.style.display = "flex";
    ghost.style.left = (clientX - 30) + "px";
    ghost.style.top = (clientY - 30) + "px";
  }

  function hideDragGhost() {
    var ghost = document.getElementById("drag-ghost");
    if (ghost) {
      ghost.style.display = "none";
    }
  }

  /* ───── 铲子光标 ───── */

  function updateShovelCursor(clientX, clientY) {
    var state = window.GameState.getGameState();
    var cursor = document.getElementById("shovel-cursor");

    if (state.selection.shovelMode) {
      if (!cursor) {
        cursor = document.createElement("div");
        cursor.id = "shovel-cursor";
        cursor.className = "shovel-cursor";
        cursor.textContent = "铲";
        document.getElementById("drag-layer").appendChild(cursor);
      }
      cursor.style.display = "flex";
      cursor.style.left = (clientX + 14) + "px";
      cursor.style.top = (clientY + 14) + "px";
      document.body.classList.add("is-shovel-mode");
    } else {
      if (cursor) {
        cursor.style.display = "none";
      }
      document.body.classList.remove("is-shovel-mode");
    }
  }

  function hideShovelCursor() {
    var cursor = document.getElementById("shovel-cursor");
    if (cursor) {
      cursor.style.display = "none";
    }
    document.body.classList.remove("is-shovel-mode");
  }

  /* ───── 悬停格子 ───── */

  function updateDragHover(clientX, clientY) {
    var cell = getCellFromPoint(clientX, clientY);
    var state = window.GameState.getGameState();
    state.ui.hoverRow = cell ? cell.row : -1;
    state.ui.hoverCol = cell ? cell.col : -1;
  }

  function updateShovelHover(event) {
    var state = window.GameState.getGameState();
    if (!state.selection.shovelMode) {
      return;
    }
    var cell = getCellFromPoint(event.clientX, event.clientY);
    state.ui.hoverRow = cell ? cell.row : -1;
    state.ui.hoverCol = cell ? cell.col : -1;
  }

  function clearHoverCell() {
    var state = window.GameState.getGameState();
    state.ui.hoverRow = -1;
    state.ui.hoverCol = -1;
  }

  function getCellFromPoint(clientX, clientY) {
    var gridLayer = document.getElementById("grid-layer");
    if (!gridLayer) {
      return null;
    }

    var rect = gridLayer.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;

    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) {
      return null;
    }

    var cols = window.GameConfig.GAME_CONFIG.boardCols;
    var rows = window.GameConfig.GAME_CONFIG.boardRows;
    var col = Math.floor(x / (rect.width / cols));
    var row = Math.floor(y / (rect.height / rows));

    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      return null;
    }

    return { row: row, col: col };
  }

  /* ───── 格子 / 实体处理 ───── */

  /**
   * 处理格子点击
   */
  function handleGridClick(event) {
    var target = event.target.closest("[data-role='grid-cell']");
    if (!target) {
      return;
    }

    var row = Number(target.dataset.row);
    var col = Number(target.dataset.col);
    var state = window.GameState.getGameState();

    if (state.meta.status !== "running") {
      window.GameMain.startGame();
    }

    if (state.selection.shovelMode) {
      removePlantAtCell(state, row, col);
      return;
    }

    if (!state.selection.plantType) {
      return;
    }

    plantSeedAtCell(state, row, col, state.selection.plantType);
  }

  /**
   * 处理实体点击
   */
  function handleEntityClick(event) {
    var target = event.target.closest("[data-role='sun-item']");
    if (!target) {
      return;
    }

    var sunId = target.dataset.sunId || "";
    var state = window.GameState.getGameState();

    var rect = target.getBoundingClientRect();
    var startX = rect.left + rect.width / 2;
    var startY = rect.top + rect.height / 2;

    window.GameSun.collectSun(state, sunId);
    flySunToCounter(startX, startY);
    window.GameRender.renderGame(state);
  }

  /**
   * 铲除植物
   */
  function removePlantAtCell(state, row, col) {
    window.GamePlants.removePlant(state, row, col);
    window.GameRender.renderGame(state);
  }

  /**
   * 种植植物
   */
  function plantSeedAtCell(state, row, col, plantType) {
    var planted = window.GamePlants.plantSeed(state, row, col, plantType);
    if (planted) {
      window.GameState.setSelection("", false);
    }
    window.GameRender.renderGame(state);
  }

  /* ───── 阳光飞行 ───── */

  function flySunToCounter(startX, startY) {
    var counter = document.getElementById("sun-count");
    if (!counter) {
      return;
    }
    var counterRect = counter.getBoundingClientRect();
    var endX = counterRect.left + counterRect.width / 2;
    var endY = counterRect.top + counterRect.height / 2;

    var dx = endX - startX;
    var dy = endY - startY;

    var flyEl = document.createElement("div");
    flyEl.className = "sun-fly";
    flyEl.innerHTML = '<img src="./assets/images/ui/sun.svg" alt="" style="width:36px;height:36px;object-fit:contain;">';
    flyEl.style.left = (startX - 18) + "px";
    flyEl.style.top = (startY - 18) + "px";

    var layer = document.getElementById("drag-layer");
    layer.appendChild(flyEl);

    var anim = flyEl.animate([
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: "translate(0, -40px) scale(1.2)", opacity: 1, offset: 0.25 },
      { transform: "translate(" + dx + "px, " + dy + "px) scale(0.4)", opacity: 0.6 }
    ], {
      duration: 480,
      easing: "cubic-bezier(0.4, 0, 0.9, 0.5)",
      fill: "forwards"
    });

    anim.onfinish = function () {
      flyEl.remove();
    };
  }

  /* ───── 工具函数 ───── */

  function canAffordPlant(plantType) {
    var state = window.GameState.getGameState();
    var config = window.GameConfig.PLANT_CONFIG[plantType];
    return config && state.cards.cooldowns[plantType] <= 0 && state.resources.sun >= config.cost;
  }

  window.GameEvents = {
    bindGameEvents: bindGameEvents,
    handleCardClick: handleCardClick,
    handleShovelClick: handleShovelClick,
    handleGridClick: handleGridClick
  };
})();
