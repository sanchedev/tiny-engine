/** **`Vector2`** class helps to manage points in the plane. */
export class Vector2 {
  /** Vector in position ZERO (0, 0) */
  static get ZERO() {
    return new Vector2(0, 0)
  }
  /** Vector in position ONE (1, 1) */
  static get ONE() {
    return new Vector2(1, 1)
  }

  constructor(
    /** The **`x`** property of `Vector2` represents the x-coordinate. */
    public x: number,
    /** The **`y`** property of `Vector2` represents the y-coordinate. */
    public y: number,
  ) {}

  /**
   * The **`clone`** method clones the vector without the same reference.
   */
  clone() {
    return new Vector2(this.x, this.y)
  }

  /**
   * The **`add`** method adds other vector to this vector.
   * @param vector2
   */
  add(vector2: Vector2): Vector2
  /**
   * The **`add`** method adds a number to `x` and `y` of this vector.
   * @param vector2
   */
  add(num: number): Vector2
  add(arg: Vector2 | number): Vector2 {
    if (arg instanceof Vector2) {
      this.x += arg.x
      this.y += arg.y
    }
    if (typeof arg === 'number') {
      this.x += arg
      this.y += arg
    }

    return this
  }

  /**
   * The **`toAdded`** method clones this vector and adds other vector to the clone.
   * @param vector2
   */
  toAdded(vector2: Vector2): Vector2
  /**
   * The **`toAdded`** method clones this vector and adds a number to `x` and `y` of the clone.
   * @param vector2
   */
  toAdded(num: number): Vector2
  toAdded(arg: Vector2 | number): Vector2 {
    const vector2 = this.clone()
    if (arg instanceof Vector2) {
      vector2.x += arg.x
      vector2.y += arg.y
    }
    if (typeof arg === 'number') {
      vector2.x += arg
      vector2.y += arg
    }

    return vector2
  }

  /**
   * The **`subtract`** method subtracts other vector to this vector.
   * @param vector2
   */
  subtract(vector2: Vector2): Vector2
  /**
   * The **`subtract`** method subtracts a number to `x` and `y` of this vector.
   * @param vector2
   */
  subtract(num: number): Vector2
  subtract(arg: Vector2 | number): Vector2 {
    if (arg instanceof Vector2) {
      this.x -= arg.x
      this.y -= arg.y
    }
    if (typeof arg === 'number') {
      this.x -= arg
      this.y -= arg
    }

    return this
  }

  /**
   * The **`toSubtracted`** method clones this vector and subtracts other vector to the clone.
   * @param vector2
   */
  toSubtracted(vector2: Vector2): Vector2
  /**
   * The **`toSubtracted`** method clones this vector and subtracts a number to `x` and `y` of the clone.
   * @param vector2
   */
  toSubtracted(num: number): Vector2
  toSubtracted(arg: Vector2 | number): Vector2 {
    const vector2 = this.clone()
    if (arg instanceof Vector2) {
      vector2.x -= arg.x
      vector2.y -= arg.y
    }
    if (typeof arg === 'number') {
      vector2.x -= arg
      vector2.y -= arg
    }

    return vector2
  }

  /**
   * The **`multiply`** method multiplies other vector to this vector.
   * @param vector2
   */
  multiply(vector2: Vector2): Vector2
  /**
   * The **`multiply`** method multiplies a number to `x` and `y` of this vector.
   * @param vector2
   */
  multiply(num: number): Vector2
  multiply(arg: Vector2 | number): Vector2 {
    if (arg instanceof Vector2) {
      this.x *= arg.x
      this.y *= arg.y
    }
    if (typeof arg === 'number') {
      this.x *= arg
      this.y *= arg
    }

    return this
  }

  /**
   * The **`toMultiplied`** method clones this vector and multiplies other vector to the clone.
   * @param vector2
   */
  toMultiplied(vector2: Vector2): Vector2
  /**
   * The **`toMultiplied`** method clones this vector and multiplies a number to `x` and `y` of the clone.
   * @param vector2
   */
  toMultiplied(num: number): Vector2
  toMultiplied(arg: Vector2 | number): Vector2 {
    const vector2 = this.clone()
    if (arg instanceof Vector2) {
      vector2.x *= arg.x
      vector2.y *= arg.y
    }
    if (typeof arg === 'number') {
      vector2.x *= arg
      vector2.y *= arg
    }

    return vector2
  }
}
