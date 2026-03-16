import esbuild from 'esbuild'
import { buildOptions } from './build-options.js'

const ctx = await esbuild.context(buildOptions)

await ctx.watch()

console.log('watching...')
