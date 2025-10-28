import 'dotenv/config'

const config = {
    preset: 'ts-jest/presets/default-esm', // habilita TypeScript + ESM
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // corrige imports .js no TS-ESM
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true }],
    },
}

export default config
