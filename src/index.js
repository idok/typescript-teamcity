#!/usr/bin/env node
'use strict'
const debug = require('debug')('ts-tc')
const isCi = require('is-ci')
const execa = require('execa')
const tsm = require('teamcity-service-messages')
const {parseAndPrint} = require('./utils')
const process = require('process')

function getArgs(originalArgs) {
    const ciArgs = ['--pretty', 'false']
    if (isCi) {
        return ['tsc', ...originalArgs, ...ciArgs]
    }
    return ['tsc', ...originalArgs]
}

async function run() {
    const originalArgs = process.argv.slice(2)
    console.log('running tsc', originalArgs)
    const args = getArgs(originalArgs)
    execa.sync('yarn', args)
    if (isCi) {
        tsm.buildProblem({description: 'typescript compilation error', identity: 'typescript'})
    }
    debug('typescript done')
}

run().catch(e => {
    if (isCi) {
        tsm.buildProblem({description: 'typescript compilation error', identity: 'typescript'})
        parseAndPrint(e.message)
    }
    process.exit(e.errno)
})
