import pino from 'pino'

export const formatLog = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ')
}

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export default logger
