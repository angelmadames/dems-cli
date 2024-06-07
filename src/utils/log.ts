import pino from 'pino'
import pretty from 'pino-pretty'

export const formatLog = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ')
}

const stream = pretty({
  colorize: true,
  sync: true,
})

const logger = pino(stream)

export default logger
