import * as request from 'request';
import * as EmailValidator from 'email-deep-validator'

const contexts = {
  name: {
    es: 'El nombre',
    en: 'the name'
  },
  email: {
    es: 'El email',
    en: 'Email'
  },
  message: {
    es: 'El mensaje',
    en: 'Message'
  }
}

const errors = {
  undefined: {
    en: 'is not valid',
    es: 'no es válido'
  },
  internal: {
    en: 'is unable to validate, try again later',
    es: 'no se pudo verificar, intenta más tarde'
  },
  string: {
    en: 'must contain words',
    es: 'debe contener palabras'
  },
  email: {
    en: 'is not a valid email address',
    es: 'no es una dirección de correo válida'
  },
  min: {
    en: min => `must be at least ${min} chars long`,
    es: min => `debe ser de al menos ${min} carácteres`
  },
  max: {
    en: max => `must contain ${max} chars at most`,
    es: max => `debe contener a lo más ${max} carácteres`
  }
}

const validateLength = (ctx: string, str: string, lang: string, ...args) => {
  let min, max;

  if (args.length === 1) {
    min = 0
    max = args[0]
  } else {
    min = args[0]
    max = args[1]
  }

  if (!contexts.hasOwnProperty(ctx)) {
    throw TypeError(context[ctx][lang] + ' ' +  errors.undefined[lang])
  }

  if (typeof str !== 'string' && !(str instanceof String)) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.string[lang])
  }

  if (str.length < min) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.min[lang](min))
  }

  if (str.length > max) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.max[lang](max))
  }
}

const validateEmail = async (ctx: string, str: string, lang, ...args) => {
  if (!contexts.hasOwnProperty(ctx)) {
    throw TypeError(context[ctx][lang] + ' ' +  errors.undefined[lang])
  }

  if (typeof str !== 'string' && !(str instanceof String)) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.string[lang])
  }

  //validateLength(ctx, str, lang, args)
  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(str)) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.email[lang])
  }

  const validation = await EmailValidator.verify(str)

  if (!validation.wellFormed || !validation.validDomain) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.email[lang]));
  }

  return true;
}

export const validators = {
  email: validateEmail
}