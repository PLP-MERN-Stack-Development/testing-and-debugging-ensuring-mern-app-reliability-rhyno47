const { validateBugPayload } = require('../src/utils/validation');

describe('validateBugPayload', () => {
  test('valid payload returns valid true', () => {
    const { valid, errors } = validateBugPayload({ title: 'Fix login', description: 'Error on line 34' });
    expect(valid).toBe(true);
    expect(errors.length).toBe(0);
  });

  test('short title returns error', () => {
    const { valid, errors } = validateBugPayload({ title: 'hi', description: '' });
    expect(valid).toBe(false);
    expect(errors).toContain('Title must be at least 3 characters long');
  });

  test('long description returns error', () => {
    const longDesc = 'a'.repeat(2000);
    const { valid, errors } = validateBugPayload({ title: 'Good title', description: longDesc });
    expect(valid).toBe(false);
    expect(errors).toContain('Description is too long');
  });
});
