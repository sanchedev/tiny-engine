import type { FontWeight, TextAlign } from '../../core/theme.js'
import { GameConfig } from '../../core/game-config.js'
import { Node, type NodeOptions } from '../node.js'
import { Nodes } from '../types.js'

export interface TextOptions extends NodeOptions {
  text: string
  textAlign?: TextAlign
  fontSize?: number
  fontWeight?: FontWeight
  fontFamily?: string
  foregroundColor?: string
  width: number
}

export const textNodeName = 'text'

export class Text extends Node {
  text: string
  textAlign: TextAlign | undefined
  fontWeight: FontWeight | undefined
  fontFamily: string | undefined
  fontSize: number | undefined
  foregroundColor: string | undefined
  width: number

  constructor(options: TextOptions) {
    super({ ...options, id: options.id ?? textNodeName })

    this.text = options.text
    this.textAlign = options.textAlign
    this.fontSize = options.fontSize
    this.fontWeight = options.fontWeight
    this.fontFamily = options.fontFamily
    this.foregroundColor = options.foregroundColor
    this.width = options.width

    this.setupText()
    const textMetrics = GameConfig.ctx.measureText(this.text)
    if (textMetrics.width > this.width) {
      throw new Error(
        `The text "${this.text}" has width = ${textMetrics.width}, but the Text.width = ${this.width}.`,
      )
    }
  }

  setupText() {
    const foregroundColor =
      this.foregroundColor ?? GameConfig.theme.textStyle.foregroundColor
    const textAlign = this.textAlign ?? GameConfig.theme.textStyle.textAlign
    const fontWeight = this.fontWeight ?? GameConfig.theme.textStyle.fontWeight
    const fontSize = this.fontSize ?? GameConfig.theme.textStyle.fontSize
    const fontFamily = this.fontFamily || GameConfig.theme.textStyle.fontFamily

    GameConfig.ctx.fillStyle = foregroundColor
    GameConfig.ctx.textAlign = textAlign
    GameConfig.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    GameConfig.ctx.textBaseline = 'top'
  }

  draw(delta: number): void {
    this.setupText()
    GameConfig.ctx.fillText(
      this.text,
      this.position.x,
      this.position.y,
      this.width,
    )
    super.draw(delta)
  }
}

Nodes.text = Text
