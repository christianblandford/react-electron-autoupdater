declare const eventTypes: readonly ["error", "checking-for-update", "update-available", "update-not-available", "update-downloading", "update-downloaded", "before-quit-for-update"];
export declare type ElectronAutoUpdaterStatus = typeof eventTypes[number];
export declare type ElectronGithubAutoUpdaterIpcEvent = {
    eventName: ElectronAutoUpdaterStatus;
    eventDetails?: any;
};
export declare type ElectronAutoUpdater = {
    status: ElectronAutoUpdaterStatus;
    details?: any;
};
export declare const useElectronAutoUpdater: () => {
    updater: ElectronAutoUpdater;
    checkForUpdates: () => void;
    quitAndInstall: () => void;
};
export declare const unsafeCheckForUpdates: () => void;
export declare const unsafeQuitAndInstall: () => void;
export declare const clearCache: () => void;
export declare const getVersion: () => any;
export {};
