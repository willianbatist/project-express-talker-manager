function validateEmail(req, res, next) {
  const { email, password } = req.body;
  const emailRegex = /[a-z0-9]+[@]+[a-z]+[.]+[a-z]/;
  if (!email) return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
}

function validationName(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res
      .status(400)
      .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
}

function validationAge(req, res, next) {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (Number(age) < 18) {
    return res
      .status(400)
      .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
}

function validationTalk(req, res, next) {
  const { talk } = req.body;
  if (!talk || talk.rate === undefined || !talk.watchedAt) {
    return res.status(400).json({ message:
          'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
      });
  }
  return next();
}

function validationRate(req, res, next) {
  const { talk: { rate } } = req.body;
  if (rate < 1) {
    return res
      .status(400)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (rate > 5) {
    return res
      .status(400)
      .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
}

function validationWatchAt(req, res, next) {
  const { talk } = req.body;
  const validateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!validateRegex.test(talk.watchedAt)) {
    return res
      .status(400)
      .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
}

function tokenValidation(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
}

module.exports = {
  validateEmail,
  validationName,
  validationAge,
  validationTalk,
  validationRate,
  validationWatchAt,
  tokenValidation,
};