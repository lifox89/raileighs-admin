export enum collections {
    servidor_credits,
    servidor_device_tokens,
    servidor_franchise,
    servidor_merchants,
    servidor_store_request,
    servidor_users,
}

export enum EventTypes {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    LOADING = 'LOADING',
}

export enum status {
    PENDING     = 'PENDING',
    RECEIVED    = 'RECEIVED',
    REJECTED    = 'REJECTED',
    COMPLETED   = 'COMPLETED'
}


export enum order_type {
    DINE_IN = 'dine_in',
    ONLINE  = 'online',
    PANDA   = 'panda'
}


export const units:string[] = [
    'g',
    'pcs',
    'ml',
    'packs'
]

