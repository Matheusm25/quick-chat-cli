module.exports = toolbox => {
  async function plainPrompt(question, rl) {
    return new Promise(resolve => {
      rl.question(question, response => {
        resolve(response);
      });
    });
  }

  toolbox.plainPrompt = plainPrompt;
};
