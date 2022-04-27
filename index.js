const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const crypto = require('crypto');

const {
  validateEmail,
  validationName,
  validationAge,
  validationTalk,
  validationRate,
  validationWatchAt,
  tokenValidation,
} = require('./middleware/index');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', (_req, res) => {
  fs.readFile('./talker.json', 'utf-8')
  .then((data) => (
    res.status(200).json(JSON.parse(data))
  ));
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile('./talker.json', 'utf-8')
  .then((data) => {
    const talker = JSON.parse(data).find((r) => r.id === Number(id));
    if (!talker) res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    return res.status(200).json(talker);
  });
});

app.post('/login', validateEmail, (req, res) => {
  try {
    const { email, password } = req.body;
    const token = crypto.randomBytes(8).toString('hex');
    const valitadion = [email, password].includes(undefined);
    if (!valitadion) {
      return res.status(200).json({ token });
    }
    return res.status(401).json({ message: 'missing fields' });
  } catch (error) {
    return res.status(500).end();
  }
});

app.post('/talker',
  tokenValidation,
  validationName,
  validationAge,
  validationTalk,
  validationRate,
  validationWatchAt,
  async (req, res) => {
  const { name, age, talk } = req.body;
  const talkerReadFile = await fs.readFile('./talker.json', 'utf-8').then((data) => data);
  const result = JSON.parse(talkerReadFile);
  const id = result.length + 1;
  const obj = { id, name, age, talk };
  const array = [...result, obj];
  await fs.writeFile('./talker.json', JSON.stringify(array));
  return res.status(201).json(obj);
});