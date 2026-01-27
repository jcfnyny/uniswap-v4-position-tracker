import blockchainService from '../../src/services/BlockchainService';

describe('BlockchainService', () => {
  describe('validateAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      const validAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
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
