import { parsePhoneNumberFromString } from 'libphonenumber-js'
const EmailValidator = require('email-deep-validator')


const contexts = {
  phone: {
    es: 'El número de teléfono',
    en: 'The phone number'
  },
  from: {
    es: 'El email de contacto',
    en: 'Contact email'
  },
  amount: {
    es: 'El monto de recarga',
    en: 'Top-up amount'
  },
  product: {
    es: 'La compañía',
    en: 'The provider'
  },
  coupon: {
    es: 'El cupón',
    en: 'The coupon'
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
  phone: {
    en: 'is not a valid phone',
    es: 'no es un teléfono válido'
  },
  min: {
    en: (min:number) => `must be at least ${min} chars long`,
    es: (min:number) => `debe ser de al menos ${min} carácteres`
  },
  max: {
    en: (max:number) => `must contain ${max} chars at most`,
    es: (max:number) => `debe contener a lo más ${max} carácteres`
  },
  least: {
    en: (min:number) => `must be at least ${min}`,
    es: (min:number) => `debe ser de al menos ${min}`
  },
  most: {
    en: (max:number) => `must be ${max} at most`,
    es: (max:number) => `debe ser a lo más ${max}`
  },
  amount: {
    en: (elements:any[]) => `must be one of ${elements}`,
    es: (elements:any[]) => `debe ser uno de ${elements}`
  },
  product: {
    en: 'is not valid',
    es: 'es inválido'
  },
  coupon: {
    en: 'is not valid',
    es: 'es inválido'
  }
}

const validateEmail = async (ctx: string, str: string, lang: string) => {
  if (!contexts.hasOwnProperty(ctx)) {
    throw TypeError(contexts[ctx][lang] + ' ' +  errors.undefined[lang])
  }

  //validateLength(ctx, str, lang, args)
  if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(str)) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.email[lang])
  }

  const emailValidator = new EmailValidator();
  const {wellFormed, validDomain} = await emailValidator.verify(str);

  if (!wellFormed || !validDomain) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.email[lang]);
  }

  return true;
}

const validateAmount = (ctx: string, amount: number, lang: string, amounts: number[] = [], price: number) => {
  if (!amounts.includes(amount)){
    throw TypeError(contexts[ctx][lang] + ' ' + errors.amount[lang](amounts));
  }

  if (amount < 10 * price) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.least[lang](10) + ' MXN equivalentes');
  }

  return true;
}

const validateProduct = (ctx: string, product: string, lang: string, products: string[] = []) => {
  if (!products.includes(product)){
    throw TypeError(contexts[ctx][lang] + ' ' + errors.product[lang]);
  }

  return true;
}

const validatePhone = (ctx: string, phone: string, lang: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone, 'VE')
  if (!phoneNumber) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.phone[lang]);
  }

  if (!phoneNumber.isValid()) {
    throw TypeError(contexts[ctx][lang] + ' ' + errors.phone[lang]);
  }

  return true
}

export const validate = {
  amount: validateAmount,
  email: validateEmail,
  phone: validatePhone,
  product: validateProduct
}