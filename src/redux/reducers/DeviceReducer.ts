import { AnyAction } from "redux"
import { LOG_OUT, SAVE_DEVICES } from "../../types/device.interface"
import { DeviceList } from "../actions/DeviceAction"

export const initialListDevices: DeviceList = []

const deviceReducer = (state = JSON.parse(JSON.stringify(initialListDevices)), action: AnyAction) => {
    const { type, payload } = action
    switch (type) {
        case SAVE_DEVICES: {
            console.log(payload)
            return payload
        }
        case LOG_OUT: {
            return initialListDevices
        }
        default:
            return state;
    }
}

export default deviceReducer