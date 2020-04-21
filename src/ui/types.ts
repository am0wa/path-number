export enum AlertType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export type AlertInfo = {
  type: AlertType,
  message: string
}
