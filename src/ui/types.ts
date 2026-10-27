export enum AlertType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
}

export type AlertInfo = {
  type: AlertType,
  message: string
}
