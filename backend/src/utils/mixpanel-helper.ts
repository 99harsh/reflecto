import { mixpanel } from "./mixpanel";

export const track = (event:string, properties?:any) => {
    mixpanel.track(event, 
        {
            ...properties,
            server_ts: new Date().toLocaleDateString(),
        }
    )
}

export const getIP = (req:any) => {
    return (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress
}