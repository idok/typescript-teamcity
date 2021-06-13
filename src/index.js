#!/usr/bin/env node
'use strict'
const debug = require('debug')('ts-tc')
const isCi = require('is-ci')
const execa = require('execa')
const tsm = require('teamcity-service-messages')
const {parseAndPrint} = require('./utils')
const process = require('process')

function getArgs(originalArgs) {
    const ciArgs = isCi ? ['--pretty', 'false'] : []
    return ['tsc', ...originalArgs, ...ciArgs]
}

async function run() {
    const originalArgs = process.argv.slice(2)
    console.log('running tsc', originalArgs.join(' '))
    const args = getArgs(originalArgs)
    const {exitCode} = execa.sync('yarn', args)
    if (exitCode !== 0) {
        if (isCi) {
            tsm.buildProblem({description: 'typescript compilation error', identity: 'typescript'})
        } else {
            console.log('typescript compilation error')
        }
        debug('typescript done')
        process.exit(exitCode)
    }
    debug('typescript done')
}

run().catch(e => {
    if (isCi) {
        tsm.buildProblem({description: 'typescript compilation error', identity: 'typescript'})
        parseAndPrint(e.message)
    }
    process.exit(e.exitCode)
})
