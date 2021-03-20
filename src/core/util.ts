import moment from 'moment';
import _ from 'lodash';
import * as fs from 'fs';
import { Command } from 'commander';
const program = new Command();

const startTime = moment();

let _config;
let _gekkoMode;
let _gekkoEnv: string|Record<string, unknown>;

var _args = false;

// helper functions
export const util = {
    getConfig: function (): Record<string, unknown> {
        // cache
        if (_config)
            return _config;

        if (!program.config)
            util.die('Please specify a config file.', true);

        if (!fs.existsSync(util.dirs().gekko + program.config))
            util.die('Cannot find the specified config file.', true);

        _config = require(util.dirs().gekko + program.config);
        return _config;
    },
    // overwrite the whole config
    setConfig: function (config) {
        _config = config;
    },
    setConfigProperty: function (parent, key, value) {
        if (parent)
            _config[parent][key] = value;
        else
            _config[key] = value;
    },
    // check if two moments are corresponding
    // to the same time
    equals: function (a, b) {
        return !(a < b || a > b)
    },
    minToMs: function (min) {
        return min * 60 * 1000;
    },
    defer: function (fn) {
        return function (args) {
            args = _.toArray(arguments);
            return _.defer(function () { fn.apply(this, args) });
        }
    },
    logVersion: function () {
        return `Gekko version:`
            + `\nNodejs version:`;
    },
    die: function (m, soft) {

        if (_gekkoEnv === 'child-process') {
            return process.send({ type: 'error', error: '\n ERROR: ' + m + '\n' });
        }

        var log = console.log.bind(console);

        if (m) {
            if (soft) {
                log('\n ERROR: ' + m + '\n\n');
            } else {
                log(`\nGekko encountered an error and can\'t continue`);
                log('\nError:\n');
                log(m, '\n\n');
                log('\nMeta debug info:\n');
                log(util.logVersion());
                log('');
            }
        }
        process.exit(1);
    },
    dirs: function () {
        var ROOT = __dirname + '/../';

        return {
            gekko: ROOT,
            core: ROOT + 'core/',
            markets: ROOT + 'core/markets/',
            exchanges: ROOT + 'exchange/wrappers/',
            plugins: ROOT + 'plugins/',
            methods: ROOT + 'strategies/',
            indicators: ROOT + 'strategies/indicators/',
            budfox: ROOT + 'core/budfox/',
            importers: ROOT + 'importers/exchanges/',
            tools: ROOT + 'core/tools/',
            workers: ROOT + 'core/workers/',
            web: ROOT + 'web/',
            config: ROOT + 'config/',
            broker: ROOT + 'exchange/'
        }
    },
    inherit: function (dest, source) {
        require('util').inherits(
            dest,
            source
        );
    },
    makeEventEmitter: function (dest) {
        util.inherit(dest, require('events').EventEmitter);
    },
    setGekkoMode: function (mode) {
        _gekkoMode = mode;
    },
    gekkoMode: function () {
        if (_gekkoMode)
            return _gekkoMode;

        if (program['import'])
            return 'importer';
        else if (program.backtest)
            return 'backtest';
        else
            return 'realtime';
    },
    gekkoModes: function () {
        return [
            'importer',
            'backtest',
            'realtime'
        ]
    },
    setGekkoEnv: function (env) {
        _gekkoEnv = env;
    },
    gekkoEnv: function () {
        return _gekkoEnv || 'standalone';
    },
    launchUI: function () {
        if (program['ui'])
            return true;
        else
            return false;
    },
    getStartTime: function () {
        return startTime;
    },
}

// NOTE: those options are only used
// in stand alone mode
program
    .version(util.logVersion())
    .option('-c, --config <file>', 'Config file')
    .option('-b, --backtest', 'backtesting mode')
    .option('-i, --import', 'importer mode')
    .option('--ui', 'launch a web UI')
    .parse(process.argv);
