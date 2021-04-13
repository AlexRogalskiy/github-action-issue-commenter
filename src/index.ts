import * as core from '@actions/core'
import * as github from '@actions/github'

import { ConfigOptions } from '../typings/domain-types'
import { Optional } from '../typings/standard-types'

import { getConfigOptions } from './utils/files'
import { isNullOrUndefined, isValidFile } from './utils/validators'
import { getProperty, getRequiredProperty } from './utils/properties'
import { coreError } from './utils/loggers'

import { valueError } from './errors/value.error'

const octokit = new github.GitHub(getRequiredProperty('GITHUB_TOKEN'))

const getCommentId = async (options: ConfigOptions): Promise<Optional<number>> => {
    const {
        repoOptions,
        resourceOptions: { requestId },
    } = options

    const { data: comments } = await octokit.issues.listComments({
        ...repoOptions,
        issue_number: requestId,
    })

    const res = comments.filter(comment => comment.user.login === 'github-actions[bot]')

    if (res.length > 0) {
        return res[0].id
    }

    return null
}

const replaceComment = async (options: ConfigOptions): Promise<void> => {
    const {
        commentOptions: { message },
        repoOptions,
        resourceOptions: { requestId },
    } = options

    const commentId = await getCommentId(options)

    if (commentId) {
        await octokit.issues.updateComment({
            ...repoOptions,
            comment_id: commentId,
            body: message,
        })
    } else {
        await octokit.issues.createComment({
            ...repoOptions,
            issue_number: requestId,
            body: message,
        })
    }
}

const processComment = async (options: ConfigOptions): Promise<void> => {
    try {
        const {
            commentOptions: { message },
            resourceOptions,
            repoOptions,
        } = options

        const title = '# Report'
        const commentText = `${message}`
        const footer = `Triggered by commit: ${github.context.sha}`

        const report = [title, commentText, footer].join('\n\n')
        const commentOptions = { message: report }

        await replaceComment({ commentOptions, repoOptions, resourceOptions })
    } catch (error) {
        coreError(`Cannot process input comment report: ${options.commentOptions.message}`)
        throw error
    }
}

const buildConfigOptions = async (options: Partial<ConfigOptions>): Promise<ConfigOptions> => {
    const message = options.commentOptions?.message || getRequiredProperty('message')
    const requestId =
        options.resourceOptions?.requestId ||
        getProperty('requestId') ||
        github.context.payload.pull_request?.number

    if (isNullOrUndefined(requestId)) {
        throw valueError(`Invalid pull request identifier: ${requestId}`)
    }

    const commentOptions = { message }
    const resourceOptions = { requestId }
    const repoOptions = github.context.repo

    return {
        commentOptions,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resourceOptions,
        repoOptions,
    }
}

const getOperationStatus = async (option: Partial<ConfigOptions>): Promise<void> => {
    const options = await buildConfigOptions(option)

    return await processComment(options)
}

const executeOperation = async (...options: Partial<ConfigOptions>[]): Promise<void> => {
    const promises: Promise<void>[] = []

    for (const option of options) {
        promises.push(getOperationStatus(option))
    }

    await Promise.all(promises)
}

const getOperationResult = async (sourceData: string): Promise<void> => {
    const params = isValidFile(sourceData, '.json') ? getConfigOptions(sourceData) : [{}]

    return await executeOperation(...params)
}

const runCommentOperation = async (): Promise<void> => {
    const sourceData = getProperty('sourceData')

    await getOperationResult(sourceData)
}

export default async function run(): Promise<void> {
    try {
        await runCommentOperation()
    } catch (error) {
        core.setFailed(`Cannot process input comment data, message: ${error.message}`)
    }
}

run()
