export interface IRequest extends Request{
    payload: Payload
}

interface Payload{
    user_id: number
}