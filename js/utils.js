/**
 * 工具模块
 * 标识生成、数值处理、集合操作
 */
(function () {
  let idSeed = 0;

  /**
   * 生成标识
   */
  function createId(prefix) {
    idSeed += 1;
    return prefix + "-" + idSeed;
  }

  /**
   * 限制数值
   */
  function clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 查询实体
   */
  function findItemById(list, id) {
    return list.find(function (item) {
      return item.id === id;
    }) || null;
  }

  /**
   * 移除实体
   */
  function removeItemById(list, id) {
    return list.filter(function (item) {
      return item.id !== id;
    });
  }

  /**
   * 读取状态文本
   */
  function getStatusText(status) {
    const statusTextMap = window.GameConfig.GAME_CONFIG.statusTextMap;
    return statusTextMap[status] || status;
  }

  window.GameUtils = {
    createId,
    clampValue,
    findItemById,
    removeItemById,
    getStatusText
  };
})();
