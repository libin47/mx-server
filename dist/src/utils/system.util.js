"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installPKG = exports.isBuiltinModule = exports.formatByteSize = exports.getFolderSize = void 0;
const child_process_1 = require("child_process");
const module_1 = require("module");
const util_1 = require("util");
async function getFolderSize(folderPath) {
    try {
        return ((await (0, util_1.promisify)(child_process_1.exec)(`du -shc ${folderPath} | head -n 1 | cut -f1`, {
            encoding: 'utf-8',
        })).stdout.split('\t')[0] || 'N/A');
    }
    catch {
        return 'N/A';
    }
}
exports.getFolderSize = getFolderSize;
const formatByteSize = (byteSize) => {
    let size;
    if (byteSize > 1024 * 1024 * 1024) {
        size = `${(byteSize / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }
    else if (byteSize > 1024 * 1024) {
        size = `${(byteSize / 1024 / 1024).toFixed(2)} MB`;
    }
    else if (byteSize > 1024) {
        size = `${(byteSize / 1024).toFixed(2)} KB`;
    }
    else {
        size = `${byteSize} B`;
    }
    return size;
};
exports.formatByteSize = formatByteSize;
const isBuiltinModule = (module, ignoreList = []) => {
    return ((module_1.builtinModules || Object.keys(process.binding('natives')))
        .filter((x) => !/^_|^(internal|v8|node-inspect)\/|\//.test(x) &&
        !ignoreList.includes(x))
        .includes(module));
};
exports.isBuiltinModule = isBuiltinModule;
const LOCKS = {
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
};
const INSTALL_COMMANDS = {
    pnpm: 'install',
    yarn: 'add',
    npm: 'install',
};
const installPKG = async (name, cwd) => {
    let manager = null;
    for (const lock of Object.keys(LOCKS)) {
        const isExist = await fs.pathExists(path.join(cwd, lock));
        if (isExist) {
            manager = LOCKS[lock];
            break;
        }
    }
    if (!manager) {
        for (const managerName of Object.values(LOCKS)) {
            const res = await nothrow($ `${managerName} --version`);
            if (res.exitCode === 0) {
                manager = managerName;
                break;
            }
        }
    }
    if (!manager) {
        const npmVersion = await nothrow($ `npm -v`);
        if (npmVersion.exitCode === 0) {
            manager = 'npm';
        }
        else {
            throw new Error('No package manager found');
        }
    }
    cd(cwd);
    await $ `${manager} ${INSTALL_COMMANDS[manager]} ${name}`;
};
exports.installPKG = installPKG;
