export const SUCCESS = (data?: any) => {
    return {
        status: 200,
        message: "SUCCESS",
        data
    }
}

export const BADREQ = () =>{
    return {
        status: 400,
        message: "Bad Request"
    }
}

export const ISE = () => {
    return {
        status: 500,
        message: "INTERNAL SERVER ERROR"
    }
}

export const RESPONSES = (status: number, message: string, data:any = null) => {
    return data == null ?  {status, message } : {status, message, data }
}

export const UNAUTHACCESS = () =>{
    return {
        status: 401,
        message: "Unauthroized Access!"
    }
}