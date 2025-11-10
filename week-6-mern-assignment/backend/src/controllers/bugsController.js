const repo = require('../repository/bugsRepo');
const { validateBugPayload } = require('../utils/validation');

async function createBug(req, res, next) {
  try {
    const { title, description } = req.body || {};
    const { valid, errors } = validateBugPayload({ title, description });
    if (!valid) return res.status(400).json({ errors });

    const created = await repo.create({ title, description });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function listBugs(req, res, next) {
  try {
    const bugs = await repo.findAll();
    res.json(bugs);
  } catch (err) {
    next(err);
  }
}

async function updateBug(req, res, next) {
  try {
    const { id } = req.params;
    const update = {};
    if (typeof req.body.title === 'string') update.title = req.body.title;
    if (typeof req.body.description === 'string') update.description = req.body.description;
    if (typeof req.body.status === 'string') update.status = req.body.status;

    const updated = await repo.updateById(id, update);
    if (!updated) return res.status(404).json({ message: 'Bug not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteBug(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await repo.deleteById(id);
    if (!deleted) return res.status(404).json({ message: 'Bug not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createBug, listBugs, updateBug, deleteBug };
