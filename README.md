# react-electron-autoupdater

Easy electron autoUpdate event handling for React renderer processes.

**Note:** this documentation needs some work, I am hoping to update this soon.

## Installation & Usage

This package works best with [electron-github-autouploader](https://github.com/christianblandford/electron-github-autoupdater), which will enable download progress events, and handle all IPC communication for you automatically. It is still possible to use this package with the default electron autoUpdater, but you will need to manually handle sending ipc events to the renderer, and handle IPC events in the main process.

`yarn add react-electron-autoupdater`

`import { useElectronAutoUpdater } from 'react-electron-autoupdater'`

# Example

    import { useElectronAutoUpdater } from 'react-electron-autoupdater'

    export const Example = () => {
    const { updater, checkForUpdates, quitAndInstall } = useElectronAutoUpdater()

        if (updater.status === 'update-downloaded') {
            toast.info(`App update available! (${updater.details.releaseName})`)
        } else if(updater.status === 'error') {
            toast.error('Error updating app')
            console.error(updater.details)
        }

       return (
           <div>
            <button onClick={() => checkForUpdates()}>Check for updates</button>
           </div>
       )

}

# API

## useElectronAutoUpdater Hook

The useElectronAutoUpdater hook returns an object with 3 attributes

### updater: <ElectronAutoUpdater>

This is the main functionality of the hook. As events are emitted by autoUpdater in the main process, they can be forwarded to the render in a number of ways. This hook listens for these forwarded events on the 'ElectronAutoUpdater' channel.

As events are emitted, this object will be updated with their values and data. This object has the following structure:

    {
        status: <ElectronAutoUpdaterStatus>,
        details?: <any>
    }

### checkForUpdates

Function that alerts main process to check for updates. Invokes `ElectronAutoUpdater.checkForUpdates`.

### getVersion

Function that gets current app version from electron. Sends sync message to IPC channel: `ElectronAutoUpdater.getCurrentVersion`.

## Updater Statuses

### Status: 'error'

Returns:

- `details` Error object emitted from main process

Emitted when there is an error while updating.

### Status: 'checking-for-update'

Emitted when checking if an update has started.

### Status: 'update-available'

Emitted when there is an available update. The update is downloaded automatically.

### Status: 'update-not-available'

Emitted when there is no available update.

### Status: 'update-downloading'

Returns:

- `event` Event
- `size` Number: Total size of all files that are being downloaded
- `progress` Number: Total bytes downloaded
- `percent` Number: Percent complete

Emitted when an update is downloading.

**Note:** This status will only occur if using [electron-github-autouploader](https://github.com/christianblandford/electron-github-autoupdater), or if you manually implement download progress events in the main process.

### Status: 'update-downloaded'

Returns:

- `event` Event
- `releaseNotes` String?: Returned if release description is provided in Github.
- `releaseName` String
- `releaseDate` Date
- `updateURL` String: URL to view release in Github (html_url)

Emitted when an update has been downloaded. These values are available on all supported platforms, unlike Electron's default autoUpdater.

**Note:** It is not strictly necessary to handle this event. A successfully downloaded update will still be applied the next time the application starts.

### Status: 'before-quit-for-update'

Emitted when there is no available update.

This event is emitted after a user calls `quitAndInstall()`.
