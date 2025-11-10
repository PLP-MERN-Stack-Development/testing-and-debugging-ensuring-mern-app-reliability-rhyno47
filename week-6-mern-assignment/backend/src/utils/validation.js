function validateBugPayload({ title, description }) {
  const errors = [];
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  if (description && description.length > 1000) {
    errors.push('Description is too long');
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateBugPayload };
