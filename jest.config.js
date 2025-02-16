export default {
    testEnvironment: 'jsdom',
    transform: {},
    moduleFileExtensions: ['js'],
    testMatch: ['**/tests/**/*.spec.js'],
    setupFilesAfterEnv: ['./js/tests/jest.setup.js'],
    extensionsToTreatAsEsm: ['.js']
};
