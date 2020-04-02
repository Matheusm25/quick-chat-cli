module.exports = toolbox => {
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   

  toolbox.sleep = sleep;
};