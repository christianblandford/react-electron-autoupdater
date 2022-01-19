"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = exports.clearCache = exports.unsafeQuitAndInstall = exports.unsafeCheckForUpdates = exports.useElectronAutoUpdater = void 0;
var electron_1 = require("electron");
var react_1 = require("react");
var channelName = 'ElectronAutoUpdater';
var eventTypes = [
    'error',
    'checking-for-update',
    'update-available',
    'update-not-available',
    'update-downloading',
    'update-downloaded',
    'before-quit-for-update',
];
var useElectronAutoUpdater = function () {
    var _a = (0, react_1.useState)({
        status: 'update-not-available',
        details: null,
    }), updater = _a[0], setUpdater = _a[1];
    (0, react_1.useEffect)(function () {
        var handleUpdateEvent = function (event, _a) {
            var eventName = _a.eventName, eventDetails = _a.eventDetails;
            setUpdater({ status: eventName, details: eventDetails });
        };
        electron_1.ipcRenderer.on(channelName, handleUpdateEvent);
        // On mount, check for update
        electron_1.ipcRenderer.invoke("".concat(channelName, ".checkForUpdates"));
        return function () {
            electron_1.ipcRenderer.removeListener(channelName, handleUpdateEvent);
        };
    }, []);
    var checkForUpdates = function () {
        if (updater.status !== 'checking-for-update' && updater.status !== 'update-downloading') {
            (0, exports.unsafeCheckForUpdates)();
        }
        else {
            console.warn('Already checking for updates, cannot check again.');
        }
    };
    var quitAndInstall = function () {
        if (updater.status !== 'update-downloaded') {
            console.log(updater);
        }
        (0, exports.unsafeQuitAndInstall)();
    };
    return {
        updater: updater,
        checkForUpdates: checkForUpdates,
        quitAndInstall: quitAndInstall,
    };
};
exports.useElectronAutoUpdater = useElectronAutoUpdater;
// Try not to use these two functions, as they are unsafe. They are provided as an escape hatch to use these functions outside of a component hook.
var unsafeCheckForUpdates = function () {
    electron_1.ipcRenderer.invoke("".concat(channelName, ".checkForUpdates"));
};
exports.unsafeCheckForUpdates = unsafeCheckForUpdates;
var unsafeQuitAndInstall = function () {
    electron_1.ipcRenderer.invoke("".concat(channelName, ".quitAndInstall"));
};
exports.unsafeQuitAndInstall = unsafeQuitAndInstall;
// Deletes the temp folder that is used by electron-github-autoupdater. Should obviously only be used if something breaks
var clearCache = function () {
    electron_1.ipcRenderer.invoke("".concat(channelName, ".clearCache"));
};
exports.clearCache = clearCache;
// Gets the current app version from electron
var getVersion = function () {
    return electron_1.ipcRenderer.sendSync("".concat(channelName, ".getCurrentVersion"));
};
exports.getVersion = getVersion;
