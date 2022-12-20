import moment from 'moment'

export type LongFormat =
  | 'LTS'
  | 'LT'
  | 'L'
  | 'LL'
  | 'LLL'
  | 'LLLL'
  | 'lts'
  | 'lt'
  | 'l'
  | 'll'
  | 'lll'
  | 'llll'

export const formatDate = (
  date: Date | string,
  format: LongFormat,
) => moment(date).format(format)


export const validateDate = (date: string) => moment(date, 'YYYY-MM-DD').isValid()

