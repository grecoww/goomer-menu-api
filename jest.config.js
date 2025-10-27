import { createDefaultPreset } from 'ts-jest'

const tsJestTransformCfg = createDefaultPreset().transform

/** @type {import("jest").Config} **/
export default {
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
    transform: {
        ...tsJestTransformCfg,
    },
    testTimeout: 10000,
}
