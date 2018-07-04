// @ts-check
/// <reference path="./wallaby.d.ts"/>

/**
 * The wallaby config factory
 * @param {wallabyjs.IWallaby} wallaby The wallaby instance
 * 
 * @returns {wallabyjs.IWallabyConfig} The wallaby config to be used
 */
module.exports = wallaby => ({
    files: [
        'src/**/*.ts?(x)',
        'src/**/*.snap',
        '!src/**/*.spec.ts?(x)',
        '!src/**/__tests__/**/*.ts?(x)',
    ],
    tests: [
        'src/**/*.spec.ts?(x)',
        'src/**/__tests__/**/*.ts?(x)',
    ],

    env: {
        type: 'node',
        runner: 'node',
    },

    testFramework: 'jest',

    debug: true,
});
