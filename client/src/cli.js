const { build } = require('gluegun');

async function run(argv) {
  const cli = build()
    .brand('quick-chat-cli')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'client-*', hidden: true })
    .defaultCommand()
    .help()
    .version()
    .create();
  const toolbox = await cli.run(argv);
  return toolbox;
}

module.exports = { run };
