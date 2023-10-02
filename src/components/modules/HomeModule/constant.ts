import { FormattedDatetimeInterface } from './interface'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export const getFormattedDatetime = ({
  date,
  formatPattern = 'EEEE, PPPpp',
}: FormattedDatetimeInterface) => {
  if (!date) return null
  return format(new Date(date), formatPattern, { locale: id })
}
