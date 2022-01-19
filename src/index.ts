import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'

const channelName = 'ElectronAutoUpdater'

const eventTypes = [
  'error',
  'checking-for-update',
  'update-available',
  'update-not-available',
  'update-downloading',
  'update-downloaded',
  'before-quit-for-update',
] as const

export type ElectronAutoUpdaterStatus = typeof eventTypes[number]

export type ElectronGithubAutoUpdaterIpcEvent = {
  eventName: ElectronAutoUpdaterStatus
  eventDetails?: any
}

export type ElectronAutoUpdater = {
  status: ElectronAutoUpdaterStatus
  details?: any
}

export const useElectronAutoUpdater = () => {
  const [updater, setUpdater] = useState<ElectronAutoUpdater>({
    status: 'update-not-available',
    details: null,
  })

  useEffect(() => {
    const handleUpdateEvent = (
      event: Electron.IpcRendererEvent,
      { eventName, eventDetails }: ElectronGithubAutoUpdaterIpcEvent
    ) => {
      setUpdater({ status: eventName, details: eventDetails })
    }

    ipcRenderer.on(channelName, handleUpdateEvent)

    // On mount, check for update
    ipcRenderer.invoke(`${channelName}.checkForUpdates`)

    return () => {
      ipcRenderer.removeListener(channelName, handleUpdateEvent)
    }
  }, [])

  const checkForUpdates = () => {
    if (updater.status !== 'checking-for-update' && updater.status !== 'update-downloading') {
      unsafeCheckForUpdates()
    } else {
      console.warn('Already checking for updates, cannot check again.')
    }
  }

  const quitAndInstall = () => {
    if (updater.status !== 'update-downloaded') {
      console.log(updater)
    }
    unsafeQuitAndInstall()
  }

  return {
    updater,
    checkForUpdates,
    quitAndInstall,
  }
}

// Try not to use these two functions, as they are unsafe. They are provided as an escape hatch to use these functions outside of a component hook.
export const unsafeCheckForUpdates = () => {
  ipcRenderer.invoke(`${channelName}.checkForUpdates`)
}
export const unsafeQuitAndInstall = () => {
  ipcRenderer.invoke(`${channelName}.quitAndInstall`)
}

// Deletes the temp folder that is used by electron-github-autoupdater. Should obviously only be used if something breaks
export const clearCache = () => {
  ipcRenderer.invoke(`${channelName}.clearCache`)
}

// Gets the current app version from electron
export const getVersion = () => {
  return ipcRenderer.sendSync(`${channelName}.getCurrentVersion`)
}
