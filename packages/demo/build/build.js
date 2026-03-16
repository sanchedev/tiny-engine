import esbuild from 'esbuild'
import { buildOptions } from './build-options.js'

await esbuild.build(buildOptions)
