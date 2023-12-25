declare module "std-env" {
    export interface Process {
        client: boolean
        server: boolean
    }
    export const process: Process
}

declare interface Window {
  nextLoading: boolean;
}

declare let window: Window & typeof globalThis;
