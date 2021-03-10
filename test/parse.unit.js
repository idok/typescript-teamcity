const {parse} = require('../src/utils')

describe('parse', () => {
    it('should run only on non private mono repo packages during ci release', () => {
        const out = parse(`
        some line
ds-testkit/src/index.ts(2,7): error TS2322: Type 'number' is not assignable to type 'string'.
ds-testkit/src/index.ts(2,7): error TS6133: 'x' is declared but its value is never read.
`)
        expect(out).toEqual([
            {file: 'ds-testkit/src/index.ts(2,7)', id: 'TS2322', description: 'Type \'number\' is not assignable to type \'string\'.'},
            {file: 'ds-testkit/src/index.ts(2,7)', id: 'TS6133', description: '\'x\' is declared but its value is never read.'}
        ])
    })
})
