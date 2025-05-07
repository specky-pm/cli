import { validateComponentName, validateVersion, validateDescription } from '../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateComponentName', () => {
    it('should validate correct component names', () => {
      expect(validateComponentName('my-component').isValid).toBe(true);
      expect(validateComponentName('@scope/my-component').isValid).toBe(true);
      expect(validateComponentName('component_with_underscore').isValid).toBe(true);
    });

    it('should reject invalid component names', () => {
      expect(validateComponentName('').isValid).toBe(false);
      expect(validateComponentName('UPPERCASE').isValid).toBe(false);
      expect(validateComponentName('invalid space').isValid).toBe(false);
      expect(validateComponentName('@invalid/UPPERCASE').isValid).toBe(false);
    });
  });

  describe('validateVersion', () => {
    it('should validate correct versions', () => {
      expect(validateVersion('1.0.0').isValid).toBe(true);
      expect(validateVersion('0.1.0').isValid).toBe(true);
      expect(validateVersion('1.2.3').isValid).toBe(true);
    });

    it('should reject invalid versions', () => {
      expect(validateVersion('').isValid).toBe(false);
      expect(validateVersion('1.0').isValid).toBe(false);
      expect(validateVersion('v1.0.0').isValid).toBe(false);
      expect(validateVersion('not-a-version').isValid).toBe(false);
    });
  });

  describe('validateDescription', () => {
    it('should validate non-empty descriptions', () => {
      expect(validateDescription('A valid description').isValid).toBe(true);
    });

    it('should reject empty descriptions', () => {
      expect(validateDescription('').isValid).toBe(false);
      expect(validateDescription('   ').isValid).toBe(false);
    });
  });
});