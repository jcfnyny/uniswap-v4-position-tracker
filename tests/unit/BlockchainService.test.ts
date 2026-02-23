import blockchainService from '../../src/services/BlockchainService';

describe('BlockchainService', () => {
  describe('validateAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      const validAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
      expect(blockchainService.validateAddress(validAddress)).toBe(true);
    });

    it('should reject invalid Ethereum addresses', () => {
      const invalidAddress = '0xinvalid';
      expect(blockchainService.validateAddress(invalidAddress)).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(blockchainService.validateAddress('')).toBe(false);
    });
  });

  // Add more tests here
});
