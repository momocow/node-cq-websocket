declare module 'cq-websocket' {
  import { RequestOptions } from 'https'
  export enum WebsocketType {
    API = '/api',
    EVENT = '/event'
  }
  export interface CQRequestOptions {
    timeout: number
  }
  export interface CQWebSocketOption {
    access_token: string
    enableAPI: boolean
    enableEvent: boolean
    host: string
    port: number
    baseUrl: string
    qq: number | string
    reconnection: boolean
    reconnectionAttempts: number
    reconnectionDelay: number
    fragmentOutgoingMessages: boolean
    fragmentationThreshold: number
    tlsOptions: RequestOptions
    requestOptions: CQRequestOptions
  }

  export type MessageEvents = 'message.private'
                      | 'message.discuss'
                      | 'message.discuss.@'
                      | 'message.discuss.@.me'
                      | 'message.group'
                      | 'message.group.@'
                      | 'message.group.@.me'

  export type NoticeEvents = 'notice.group_upload'
                      | 'notice.group_admin.set'
                      | 'notice.group_admin.unset'
                      | 'notice.group_decrease.leave'
                      | 'notice.group_decrease.kick'
                      | 'notice.group_decrease.kick_me'
                      | 'notice.group_increase.approve'
                      | 'notice.group_increase.invite'
                      | 'notice.friend_add'

  export type RequestEvents = 'request.friend'
                      | 'request.group.add'
                      | 'request.group.invite'

  export type SocketEvents = 'socket.connecting'
                      | 'socket.connect'
                      | 'socket.failed'
                      | 'socket.reconnecting'
                      | 'socket.reconnect'
                      | 'socket.reconnect_failed'
                      | 'socket.max_reconnect'
                      | 'socket.closing'
                      | 'socket.close'
                      | 'socket.error'

  export type APIEvents = 'api.send.pre' | 'api.send.post' | 'api.response'

  type Events = MessageEvents | NoticeEvents | RequestEvents | SocketEvents | APIEvents

  export interface ApiTimeoutError extends Error {

  }

  export interface CQEvent {
    stopPropagation (): void
    getMessage (): string
    setMessage (msg: string): void
    appendMessage (msg: string): void
    hasMessage (): boolean
    onResponse (handler: (res: object) => void, options: number | CQRequestOptions): void
    onError (handler: (err: ApiTimeoutError) => void): void
  }

  export class CQTag {
    constructor (type: string, meta: Record<string, any>)
    equals (equals: string | CQTag): boolean
    toString  (): string
  }

  export class CQAtTag extends CQTag {
    constructor (qq: number | string)
    getQQ (): number
  }

  interface CQWebSocketClass {
    <T>(method: string, params: Record<string, any>, options: number | CQRequestOptions): Promise<T>
    connect (wsType?: WebsocketType): CQWebSocketClass
    disconnect (wsType: WebsocketType): CQWebSocketClass
    reconnect (delay: number, wsType: WebsocketType): CQWebSocketClass
    isSockConnected (wsType: WebsocketType): CQWebSocketClass
    isReady (): boolean
    on (event_type: Events, listener: Function): CQWebSocketClass
    once (event_type: Events, listener: Function): CQWebSocketClass
    off (event_type: Events, listener: Function): CQWebSocketClass
  }
  type CQWebSocketFunc<T> = (method: string, params: Record<string, any>, options: number | CQRequestOptions) => Promise<T>
  type CQWebSocketFactory<T = any> = { new (opt: Partial<CQWebSocketOption>): CQWebSocketClass } & CQWebSocketFunc<T>
  const CQWebSocket: CQWebSocketFactory
  export default CQWebSocket
}
