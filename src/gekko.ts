import { util } from './core/util';

const startup = () => {
  console.log(`
      ______   ________  __    __  __    __   ______
    /      \\ /        |/  |  /  |/  |  /  | /      \\
    /$$$$$$  |$$$$$$$$/ $$ | /$$/ $$ | /$$/ /$$$$$$  |
    $$ | _$$/ $$ |__    $$ |/$$/  $$ |/$$/  $$ |  $$ |
    $$ |/    |$$    |   $$  $$<   $$  $$<   $$ |  $$ |
    $$ |$$$$ |$$$$$/    $$$$$  \\  $$$$$  \\  $$ |  $$ |
    $$ \\__$$ |$$ |_____ $$ |$$  \\ $$ |$$  \\ $$ \\__$$ |
    $$    $$/ $$       |$$ | $$  |$$ | $$  |$$    $$/ 
    $$$$$$/  $$$$$$$$/ $$/   $$/ $$/   $$/  $$$$$$/
  `);
  console.log('\tI\'m gonna make you rich, Bud Fox.', '\n\n');

  const dirs = util.dirs();

  if (util.launchUI()) {
    return require(util.dirs().web + 'server');
  }

  const pipeline = require(dirs.core + 'pipeline');
  const config:Record<string, unknown> = util.getConfig();
  const mode = util.gekkoMode();

  // > Ever wonder why fund managers can't beat the S&P 500?
  // > 'Cause they're sheep, and sheep get slaughtered.
  pipeline({
    config: config,
    mode: mode
  });

};

startup();