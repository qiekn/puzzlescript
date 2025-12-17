"use strict";

/**
 * @class
 * @classdesc Bit Vector - A compact data structure for storing and manipulating bits efficiently.
 * Uses Int32Array internally, where each element stores 32 bits.
 */
class BitVec {
  /**
   * Creates a new BitVec instance
   * @param {number|Int32Array} init - Either the size of the array or an existing Int32Array to copy
   */
  constructor(init) {
    this.data = new Int32Array(init);
  }
  /**
   * Clones this BitVec's data into a target BitVec
   * @param {BitVec} target - The target BitVec to copy data into
   * @returns {BitVec} The target BitVec
   */
  cloneInto(target) {
    for (let i = 0; i < this.data.length; ++i) {
      target.data[i] = this.data[i];
    }
    return target;
  }
  /**
   * Creates a new BitVec with the same data as this one
   * @returns {BitVec} A new BitVec instance with copied data
   */
  clone() {
    return new BitVec(this.data);
  }
  /**
   * In-place bitwise AND operation with another BitVec
   * @param {BitVec} other - The BitVec to AND with
   */
  iand(other) {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] &= other.data[i];
    }
  }
  /**
   * In-place bitwise NOT operation (inverts all bits)
   */
  inot() {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] = ~this.data[i];
    }
  }
  /**
   * In-place bitwise OR operation with another BitVec
   * @param {BitVec} other - The BitVec to OR with
   */
  ior(other) {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] |= other.data[i];
    }
  }
  /**
   * In-place clear operation - clears bits that are set in other
   * Equivalent to: this = this & ~other
   * @param {BitVec} other - The BitVec whose set bits will be cleared from this
   */
  iclear(other) {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] &= ~other.data[i];
    }
  }
  /**
   * Sets a specific bit to 1
   * @param {number} ind - The bit index to set (0-based)
   */
  ibitset(ind) {
    this.data[ind >> 5] |= 1 << (ind & 31);
  }
  /**
   * Clears a specific bit (sets it to 0)
   * @param {number} ind - The bit index to clear (0-based)
   */
  ibitclear(ind) {
    this.data[ind >> 5] &= ~(1 << (ind & 31));
  }
  /**
   * Gets the value of a specific bit
   * @param {number} ind - The bit index to get (0-based)
   * @returns {boolean} True if the bit is set, false otherwise
   */
  get(ind) {
    return (this.data[ind >> 5] & (1 << (ind & 31))) !== 0;
  }
  /**
   * Gets bits at a shifted position and applies a mask
   * Handles cross-boundary reads when shift is not aligned to 32-bit boundaries
   * @param {number} mask - The mask to apply to the result
   * @param {number} shift - The bit position to start reading from
   * @returns {number} The masked value at the shifted position
   */
  getshiftor(mask, shift) {
    const toshift = shift & 31;
    let ret = this.data[shift >> 5] >>> toshift;
    if (toshift) {
      ret |= this.data[(shift >> 5) + 1] << (32 - toshift);
    }
    return ret & mask;
  }
  /**
   * Sets bits at a shifted position using OR operation
   * Handles cross-boundary writes when shift is not aligned to 32-bit boundaries
   * @param {number} mask - The value to OR at the shifted position
   * @param {number} shift - The bit position to start writing to
   */
  ishiftor(mask, shift) {
    const toshift = shift & 31;
    const shift_5 = shift >> 5;
    let low = mask << toshift;
    this.data[shift_5] |= low;
    if (toshift) {
      let high = mask >> (32 - toshift);
      this.data[shift_5 + 1] |= high;
    }
  }
  /**
   * Clears bits at a shifted position
   * Handles cross-boundary clears when shift is not aligned to 32-bit boundaries
   * @param {number} mask - The mask indicating which bits to clear
   * @param {number} shift - The bit position to start clearing from
   */
  ishiftclear(mask, shift) {
    const toshift = shift & 31;
    const shift_5 = shift >> 5;
    const low = mask << toshift;
    this.data[shift_5] &= ~low;
    if (toshift) {
      let high = mask >> (32 - (shift & 31));
      this.data[shift_5 + 1] &= ~high;
    }
  }
  /**
   * Checks if this BitVec is equal to another BitVec
   * @param {BitVec} other - The BitVec to compare with
   * @returns {boolean} True if both BitVecs have the same data, false otherwise
   */
  equals(other) {
    if (this.data.length !== other.data.length) return false;
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] !== other.data[i]) return false;
    }
    return true;
  }
  /**
   * Sets all bits to zero
   */
  setZero() {
    this.data.fill(0);
  }
  /**
   * Checks if all bits are zero
   * @returns {boolean} True if all bits are zero, false otherwise
   */
  iszero() {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] !== 0) return false;
    }
    return true;
  }
  /**
   * Checks if all bits set in this BitVec are also set in the given array
   * @param {Int32Array|Array} arr - The array to check against
   * @returns {boolean} True if all set bits in this are also set in arr
   */
  bitsSetInArray(arr) {
    for (let i = 0; i < this.data.length; ++i) {
      if ((this.data[i] & arr[i]) !== this.data[i]) {
        return false;
      }
    }
    return true;
  }
  /**
   * Checks if all bits set in this BitVec are clear in the given array
   * @param {Int32Array|Array} arr - The array to check against
   * @returns {boolean} True if none of the bits set in this are set in arr
   */
  bitsClearInArray(arr) {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] & arr[i]) {
        return false;
      }
    }
    return true;
  }
  /**
   * Checks if this BitVec has any bits in common with another BitVec
   * @param {BitVec} other - The BitVec to check against
   * @returns {boolean} True if at least one bit is set in both BitVecs
   */
  anyBitsInCommon(other) {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] & other.data[i]) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns a human-readable string representation of the bit vector
   * Each 32-bit segment is printed as a binary string separated by spaces
   * @returns {string} A string showing all bits (1s and 0s)
   */
  prettyPrint() {
    var result = "";
    // Print string as bit array, grouped into fives
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < 32; j++) {
        result += this.data[i] & (1 << j) ? "1" : "0";
      }
      result += " ";
    }
    return result;
  }
}

/**
 * Generates code string to set a bit at a specific index
 * @param {string} tok - The variable name of the BitVec
 * @param {number} index - The bit index to set
 * @returns {string} JavaScript code string
 */
function IBITSET(tok, index) {
  return `${tok}.data[${index}>>5] |= 1 << (${index} & 31);`;
}

/**
 * Generates code string to get a bit at a specific index
 * @param {string} tok - The variable name of the BitVec
 * @param {number} index - The bit index to get
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function GET(tok, index) {
  const shift_5 = index >> 5;
  const bit_position = 1 << (index & 31);
  return `((${tok}.data[${shift_5}] & ${bit_position}) !== 0)`;
}

/**
 * Generates code string to get bits at a shifted position with a mask
 * @param {string} tok - The variable name of the BitVec
 * @param {number} mask - The mask to apply
 * @param {number} shift - The bit position to start reading from
 * @returns {string} JavaScript code string
 */
function GETSHIFTOR(tok, mask, shift) {
  const toshift = shift & 31;
  const shift_5 = shift >> 5;
  if (toshift) {
    return `${mask}&((${tok}.data[${shift_5}] >>> ${toshift}) | (${tok}.data[${shift_5}+1] << (32-${toshift})))`;
  } else {
    return `${mask}&(${tok}.data[${shift_5}] >>> ${toshift})`;
  }
}

/**
 * Generates code string to set bits at a shifted position using OR
 * @param {string} tok - The variable name of the BitVec
 * @param {number} mask - The value to OR at the shifted position
 * @param {number} shift - The bit position to start writing to
 * @returns {string} JavaScript code string
 */
function ISHIFTOR(tok, mask, shift) {
  return `{
    let toshift = ${shift}&31;
    let low = ${mask} << toshift;
    ${tok}.data[${shift}>>5] |= low;
    if (toshift) {
      let high = ${mask} >> (32 - toshift);
      ${tok}.data[(${shift}>>5)+1] |= high;
    }
  }`;
}

/**
 * Generates code string to clear bits at a shifted position
 * @param {string} tok - The variable name of the BitVec
 * @param {number} mask - The mask indicating which bits to clear
 * @param {number} shift - The bit position to start clearing from
 * @returns {string} JavaScript code string
 */
function ISHIFTCLEAR(tok, mask, shift) {
  const toshift = shift & 31;
  const shift_5 = shift >> 5;
  const low = mask + "<<" + toshift;
  let result = `${tok}.data[${shift_5}] &= ~(${low});\n`;
  if (toshift) {
    const high = mask + ">>>" + (32 - toshift);
    result += `${tok}.data[${shift_5 + 1}] &= ~(${high});\n`;
  }
  return result;
}

/**
 * Generates code string to check equality between two BitVecs
 * @param {string} tok - The variable name of the first BitVec
 * @param {string} other - The variable name of the second BitVec
 * @param {number} array_size - The size of the data arrays
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function EQUALS(tok, other, array_size) {
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&(${tok}.data[${i}] === ${other}.data[${i}])`;
  }
  return result + ")";
}

/**
 * Generates code string to check equality between a BitVec variable and a real BitVec value
 * @param {string} tok - The variable name of the BitVec
 * @param {BitVec} other - The actual BitVec to compare against
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function EQUALS_TOK_REAL(tok, other) {
  let result = "(true";
  for (let i = 0; i < other.data.length; i++) {
    result += `&&(${tok}.data[o] === ${other.data[i]})`;
  }
  return result + ")";
}

/**
 * Generates code string to check inequality between two BitVecs
 * @param {string} tok - The variable name of the first BitVec
 * @param {string} other - The variable name of the second BitVec
 * @param {number} array_size - The size of the data arrays
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function NOT_EQUALS(tok, other, array_size) {
  let result = "(false";
  for (let i = 0; i < array_size; i++) {
    result += `||(${tok}.data[${i}] !== ${other}.data[${i}])`;
  }
  return result + ")";
}

/**
 * Generates code string to set an array to zero
 * @param {string} tok - The variable name of the array
 * @returns {string} JavaScript code string
 */
function ARRAY_SET_ZERO(tok) {
  return tok + ".fill(0);\n";
}

/**
 * Generates code string to set a BitVec to zero
 * @param {string} tok - The variable name of the BitVec
 * @returns {string} JavaScript code string
 */
function SET_ZERO(tok) {
  return tok + ".data.fill(0);\n";
}

/**
 * Generates code string to check if a BitVec is all zeros
 * @param {string} tok - The variable name of the BitVec
 * @param {number} array_size - The size of the data array
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function IS_ZERO(tok, array_size) {
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&(${tok}.data[${i}]===0)`;
  }
  return result + ")";
}

/**
 * Generates code string to check if a BitVec has any non-zero bits
 * @param {string} tok - The variable name of the BitVec
 * @param {number} array_size - The size of the data array
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function IS_NONZERO(tok, array_size) {
  let result = "(false";
  for (let i = 0; i < array_size; i++) {
    result += `||(${tok}.data[${i}]!==0)`;
  }
  return result + ")";
}

/**
 * Generates code string to check if all bits set in a BitVec are also set in an array
 * @param {string} tok - The variable name of the BitVec
 * @param {string} arr - The variable name of the array
 * @param {number} array_size - The size of the arrays
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function BITS_SET_IN_ARRAY(tok, arr, array_size) {
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&((${tok}.data[${i}] & ${arr}[${i}]) === ${tok}.data[${i}])`;
  }
  return result + ")";
}

/**
 * Generates code string to check if NOT all bits set in a BitVec are set in an array
 * @param {string} tok - The variable name of the BitVec
 * @param {string} arr - The variable name of the array
 * @param {number} array_size - The size of the arrays
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function NOT_BITS_SET_IN_ARRAY(tok, arr, array_size) {
  let result = "(false";
  for (let i = 0; i < array_size; i++) {
    result += `||((${tok}.data[${i}] & ${arr}[${i}]) !== ${tok}.data[${i}])`;
  }
  return result + ")";
}

/**
 * Generates code string to check if all bits set in a BitVec are clear in another BitVec
 * @param {string} tok - The variable name of the first BitVec
 * @param {string} arr - The variable name of the second BitVec
 * @param {number} array_size - The size of the data arrays
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function BITS_CLEAR_IN_ARRAY(tok, arr, array_size) {
  if (array_size === 0) return "true";
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&((${tok}.data[${i}] & ${arr}.data[${i}]) === 0)`;
  }
  return result + ")";
}

/**
 * Generates code string to check if two BitVecs have any bits in common
 * @param {string} tok - The variable name of the first BitVec
 * @param {string} arr - The variable name of the second BitVec
 * @param {number} array_size - The size of the data arrays
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function ANY_BITS_IN_COMMON(tok, arr, array_size) {
  if (array_size === 0) {
    return "false";
  }
  let result = "(false";
  for (let i = 0; i < array_size; i++) {
    result += `||((${tok}.data[${i}] & ${arr}.data[${i}]) !== 0)`;
  }
  return result + ")";
}

/**
 * Generates code string to check if a BitVec variable has any bits in common with a real array
 * @param {string} tok - The variable name of the BitVec
 * @param {Array} arr - The actual array to compare against
 * @returns {string} JavaScript code string that evaluates to a boolean
 */
function ANY_BITS_IN_COMMON_TOK_REAL(tok, arr) {
  if (arr.length === 0) {
    return "false";
  }
  let result = "(false";
  for (let i = 0; i < arr.length; i++) {
    result += `||((${tok}.data[${i}] & ${arr[i]}) !== 0)`;
  }
  return result + ")";
}

/**
 * Generates unrolled loop code for BitVec operations
 * This function is used to unroll loops in parallel from bitvec - it returns a string
 * representation of the JavaScript unrolled code
 * @param {string} command - A space-separated command string (e.g., "vec1 |= vec2")
 * @param {number} array_size - The number of iterations to unroll
 * @returns {string} JavaScript code string with unrolled loop
 */
function UNROLL(command, array_size) {
  const toks = command.split(" ");
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += `${toks[0]}.data[${i}] ${toks[1]} ${toks[2]}.data[${i}];\n`;
  }
  return result;
}

/**
 * Generates unrolled loop code for BitVec operations with a real value
 * @param {string} tok - The variable name of the BitVec
 * @param {string} op - The operator to apply (e.g., "=", "|=", "&=")
 * @param {BitVec} val - The actual BitVec value to use
 * @param {number} array_size - The number of iterations to unroll
 * @returns {string} JavaScript code string with unrolled loop
 */
function UNROLL_TOK_REAL(tok, op, val, array_size) {
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += tok + ".data[" + i + "]" + op + val.data[i] + ";\n";
  }
  return result;
}

/**
 * Generates code string to copy a cell from a level's objects array into a target BitVec
 * @param {string} level - The variable name of the level object
 * @param {number} index - The cell index to read from
 * @param {string} targetarray - The variable name of the target BitVec
 * @param {number} OBJECT_SIZE - The size of each object in the level
 * @returns {string} JavaScript code string
 */
function LEVEL_GET_CELL_INTO(level, index, targetarray, OBJECT_SIZE) {
  let result = "";
  for (let i = 0; i < OBJECT_SIZE; i++) {
    result +=
      targetarray +
      `.data[${i}]=level.objects[${index}*${OBJECT_SIZE}+${i}];\n`;
  }
  return result;
}

/**
 * Generates code string to copy movement data from a level into a target BitVec
 * @param {number} index - The movement index to read from
 * @param {string} targetarray - The variable name of the target BitVec
 * @param {number} MOVEMENT_SIZE - The size of each movement in the level
 * @returns {string} JavaScript code string
 */
function LEVEL_GET_MOVEMENTS_INTO(index, targetarray, MOVEMENT_SIZE) {
  let result = "";
  for (let i = 0; i < MOVEMENT_SIZE; i++) {
    result +=
      targetarray +
      `.data[${i}]=level.movements[${index}*${MOVEMENT_SIZE}+${i}];\n`;
  }
  return result;
}

/**
 * Generates code string to set a cell in a level's objects array from a BitVec
 * @param {string} level - The variable name of the level object
 * @param {number} index - The cell index to write to
 * @param {string} vec - The variable name of the source BitVec
 * @param {number} array_size - The size of the data array
 * @returns {string} JavaScript code string
 */
function LEVEL_SET_CELL(level, index, vec, array_size) {
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += `\t${level}.objects[${index}*${array_size}+${i}]=${vec}.data[${i}];\n`;
  }
  return result;
}

/**
 * Generates code string to import compile-time array data into a runtime BitVec
 * @param {string} runtime - The variable name of the runtime BitVec
 * @param {BitVec} compiletime - The compile-time BitVec to import from
 * @param {number} array_size - The size of the data array
 * @returns {string} JavaScript code string
 */
function IMPORT_COMPILE_TIME_ARRAY(runtime, compiletime, array_size) {
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += `${runtime}.data[${i}]=${compiletime.data[i]};\n`;
  }
  return result;
}
