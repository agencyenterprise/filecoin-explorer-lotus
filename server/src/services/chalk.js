import chalkJs from 'chalk'

const pending = (text) => {
  let str = chalkJs.bold.cyan('? ')
  str += chalkJs.cyan.italic(text)

  console.info(str)
}

const success = (text) => {
  console.info(chalkJs.bold.green(`! ${text}`))
}

const error = (message, original = '') => {
  console.error(chalkJs.bold.red(`X ${message}`))
  if (original) console.error(original)
}

export const chalk = {
  pending,
  success,
  error,
}
