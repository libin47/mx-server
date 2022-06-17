"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProvider = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const app_config_1 = require("../../app.config");
const system_constant_1 = require("../../constants/system.constant");
exports.databaseProvider = {
    provide: system_constant_1.DB_CONNECTION_TOKEN,
    useFactory: async () => {
        let reconnectionTask = null;
        const RECONNECT_INTERVAL = 6000;
        const connection = () => {
            return typegoose_1.mongoose.connect(app_config_1.MONGO_DB.uri, {});
        };
        const Badge = `[${chalk.yellow('MongoDB')}]`;
        const color = (str, ...args) => {
            return str.map((s) => chalk.green(s)).join('');
        };
        typegoose_1.mongoose.connection.on('connecting', () => {
            consola.info(Badge, color `connecting...`);
        });
        typegoose_1.mongoose.connection.on('open', () => {
            consola.info(Badge, color `readied!`);
            if (reconnectionTask) {
                clearTimeout(reconnectionTask);
                reconnectionTask = null;
            }
        });
        typegoose_1.mongoose.connection.on('disconnected', () => {
            consola.error(Badge, chalk.red(`disconnected! retry when after ${RECONNECT_INTERVAL / 1000}s`));
            reconnectionTask = setTimeout(connection, RECONNECT_INTERVAL);
        });
        typegoose_1.mongoose.connection.on('error', (error) => {
            consola.error(Badge, 'error!', error);
            typegoose_1.mongoose.disconnect();
        });
        return await connection().then((mongoose) => mongoose.connection);
    },
};
