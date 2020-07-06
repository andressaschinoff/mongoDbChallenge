import { db } from '../models/index.js';
import { logger } from '../config/logger.js';
import { gradeModel } from '../models/gradeModels.js';

const create = async (req, res) => {
  const name = req.body.name;
  const subject = req.body.subject;
  const type = req.body.type;
  const value = req.body.value;

  try {
    const newGrade = await gradeModel.insertMany({
      name: name,
      subject: subject,
      type: type,
      value: value,
    });
    res.send(newGrade);
    logger.info(`POST /grade - ${JSON.stringify(newGrade)}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const allGrades = await gradeModel.find(condition);

    if (allGrades.length < 1) {
      res.send('Este nome não está entre os dados do banco');
    }

    res.send(allGrades);
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await gradeModel.findById(id);
    res.send(grade);

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;
  const newName = req.body.name;
  const newSubject = req.body.subject;
  const newType = req.body.type;
  const newValue = req.body.value;

  try {
    const grade = await gradeModel.findById(id);

    const name = newName ? newName : grade.name;
    const subject = newSubject ? newSubject : grade.subject;
    const type = newType ? newType : grade.type;
    const value = newValue ? newValue : grade.value;

    await gradeModel.findByIdAndUpdate(id, {
      name: name,
      subject: subject,
      type: type,
      value: value,
    });
    res.send({ message: 'Grade atualizado com sucesso' });

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await gradeModel.findByIdAndRemove(id);
    res.send({ message: 'Grade excluido com sucesso' });

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};
  try {
    const findGradeToRemove = await gradeModel.find(condition);
    if (findGradeToRemove.length < 1) {
      res.send('Este nome não está entre os dados do banco');
    }

    await gradeModel.remove(condition);
    res.send({
      message: `Grades excluidos`,
    });
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
