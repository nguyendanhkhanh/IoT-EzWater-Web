import { SAVE_DEVICES } from "../../types/device.interface"

export type Device = {
    macAddress: string,
    nameDevice: string,
    id: string
}

export type DeviceList = Device[]

export function saveDevices (payload: DeviceList) {
    return {
        type: SAVE_DEVICES,
        payload: payload
    }
}
