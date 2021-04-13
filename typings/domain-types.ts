import boxen from 'boxen'

/**
 * ConfigOptions
 * @desc Type representing configuration options
 */
export type ConfigOptions = {
    /**
     * Comment configuration options
     */
    readonly commentOptions: CommentOptions
    /**
     * Repo configuration options
     */
    readonly repoOptions: RepoOptions
    /**
     * Resource configuration options
     */
    readonly resourceOptions: ResourceOptions
}

//--------------------------------------------------------------------------------------------------
/**
 * CommentOptions
 * @desc Type representing comment options
 */
export type CommentOptions = {
    /**
     * Comment message
     */
    readonly message: string
}

//--------------------------------------------------------------------------------------------------
/**
 * ResourceOptions
 * @desc Type representing resource options
 */
export type RepoOptions = {
    /**
     * Repo owner
     */
    owner: string
    /**
     * Repo name
     */
    repo: string
}

//--------------------------------------------------------------------------------------------------
/**
 * ResourceOptions
 * @desc Type representing resource options
 */
export type ResourceOptions = {
    /**
     * Request identifier
     */
    requestId: number
}

//--------------------------------------------------------------------------------------------------
/**
 * ProfileOptions
 * @desc Type representing profiles options
 */
export type ProfileOptions = {
    /**
     * Output options
     */
    readonly outputOptions?: boxen.Options
}

//--------------------------------------------------------------------------------------------------
