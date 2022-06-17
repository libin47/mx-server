"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDefaultConfig = void 0;
const app_config_1 = require("../../app.config");
const generateDefaultConfig = () => ({
    seo: {
        title: '我的小世界呀',
        description: '哈喽~欢迎光临',
        keywords: [],
    },
    url: {
        wsUrl: '',
        adminUrl: '',
        serverUrl: '',
        webUrl: '',
    },
    mailOptions: {
        enable: false,
        user: '',
        pass: '',
        options: {
            host: '',
            port: 465,
        },
    },
    commentOptions: {
        antiSpam: false,
        blockIps: [],
        disableNoChinese: false,
        fetchLocationTimeout: 3000,
        recordIpLocation: true,
        spamKeywords: [],
    },
    barkOptions: {
        enable: false,
        key: '',
        serverUrl: 'https://api.day.app',
        enableComment: true,
    },
    friendLinkOptions: { allowApply: true },
    backupOptions: {
        enable: app_config_1.isInDemoMode ? false : true,
        region: null,
        bucket: null,
        secretId: null,
        secretKey: null,
    },
    baiduSearchOptions: { enable: false, token: null },
    algoliaSearchOptions: { enable: false, apiKey: '', appId: '', indexName: '' },
    adminExtra: {
        enableAdminProxy: true,
        title: 'おかえり~',
        background: '',
        gaodemapKey: null,
    },
    terminalOptions: {
        enable: false,
        password: null,
        script: null,
    },
    textOptions: {
        macros: true,
    },
});
exports.generateDefaultConfig = generateDefaultConfig;
