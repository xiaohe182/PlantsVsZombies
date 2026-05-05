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
      lane,
      type: zombieType,
      name: zombieConfig.name,
      label: zombieConfig.label
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
  function updateZombies() {
    return;
  }

  /**
   * 僵尸受伤
   */
  function damageZombie() {
    return;
  }

  window.GameZombies = {
    createZombie,
    spawnZombie,
    updateZombies,
    damageZombie
  };
})();
