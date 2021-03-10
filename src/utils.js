'use strict'
const tsm = require('teamcity-service-messages')
const regex = /^(\S+):\serror\s(TS\S+):\s([\W+\S]+)$/

function parse(p) {
    return p.split('\n').filter(x => regex.test(x)).map(x => {
        const matches = x.match(regex)
        if (matches.length > 3) {
            return {
                file: matches[1],
                id: matches[2],
                description: matches[3]
            }
        }
        return null
    }).filter(Boolean)
}

function parseAndPrint(p) {
    const lines = parse(p)
    lines.forEach(({id, description, file}) => {
        tsm.testFailed({name: 'typescript', message: description, details: `${id} ${description} ${file}`})
    })
}

module.exports = {
    parseAndPrint,
    parse
}
