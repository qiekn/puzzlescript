"use strict";

/**
 * @class
 * @classdesc Bit Vector
 */
class BitVec {
  constructor(init) {
    this.data = new Int32Array(init);
  }
  cloneInto(target) {
    for (let i = 0; i < this.data.length; ++i) {
      target.data[i] = this.data[i];
    }
    return target;
  }
  clone() {
    return new BitVec(this.data);
  }
  iand(other) {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] &= other.data[i];
    }
  }
  inot() {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] = ~this.data[i];
    }
  }
  ior(other) {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] |= other.data[i];
    }
  }
  iclear(other) {
    for (let i = 0; i < this.data.length; ++i) {
      this.data[i] &= ~other.data[i];
    }
  }
  ibitset(ind) {
    this.data[ind >> 5] |= 1 << (ind & 31);
  }
  ibitclear(ind) {
    this.data[ind >> 5] &= ~(1 << (ind & 31));
  }
  get(ind) {
    return (this.data[ind >> 5] & (1 << (ind & 31))) !== 0;
  }
  getshiftor(mask, shift) {
    const toshift = shift & 31;
    let ret = this.data[shift >> 5] >>> toshift;
    if (toshift) {
      ret |= this.data[(shift >> 5) + 1] << (32 - toshift);
    }
    return ret & mask;
  }
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
  equals(other) {
    if (this.data.length !== other.data.length) return false;
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] !== other.data[i]) return false;
    }
    return true;
  }
  setZero() {
    this.data.fill(0);
  }
  iszero() {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] !== 0) return false;
    }
    return true;
  }
  bitsSetInArray(arr) {
    for (let i = 0; i < this.data.length; ++i) {
      if ((this.data[i] & arr[i]) !== this.data[i]) {
        return false;
      }
    }
    return true;
  }
  bitsClearInArray(arr) {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] & arr[i]) {
        return false;
      }
    }
    return true;
  }
  anyBitsInCommon(other) {
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i] & other.data[i]) {
        return true;
      }
    }
    return false;
  }
  prettyPrint() {
    var result = "";
    //print string as bit array, grouped into fives
    for (let i = 0; i < this.data.length; i++) {
      for (let j = 0; j < 32; j++) {
        result += this.data[i] & (1 << j) ? "1" : "0";
      }
      result += " ";
    }
    return result;
  }
}

function IBITSET(tok, index) {
  return `${tok}.data[${index}>>5] |= 1 << (${index} & 31);`;
}

function GET(tok, index) {
  const shift_5 = index >> 5;
  const bit_position = 1 << (index & 31);
  return `((${tok}.data[${shift_5}] & ${bit_position}) !== 0)`;
}

function GETSHIFTOR(tok, mask, shift) {
  const toshift = shift & 31;
  const shift_5 = shift >> 5;
  if (toshift) {
    return `${mask}&((${tok}.data[${shift_5}] >>> ${toshift}) | (${tok}.data[${shift_5}+1] << (32-${toshift})))`;
  } else {
    return `${mask}&(${tok}.data[${shift_5}] >>> ${toshift})`;
  }
}

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

function EQUALS(tok, other, array_size) {
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&(${tok}.data[${i}] === ${other}.data[${i}])`;
  }
  return result + ")";
}

function EQUALS_TOK_REAL(tok, other) {
  let result = "(true";
  for (let i = 0; i < other.data.length; i++) {
    result += `&&(${tok}.data[o] === ${other.data[i]})`;
  }
  return result + ")";
}

function NOT_EQUALS(tok, other, array_size) {
  let result = "(false";
  for (let i = 0; i < array_size; i++) {
    result += `||(${tok}.data[${i}] !== ${other}.data[${i}])`;
  }
  return result + ")";
}

function ARRAY_SET_ZERO(tok) {
  return tok + ".fill(0);\n";
}

function SET_ZERO(tok) {
  return tok + ".data.fill(0);\n";
}

function IS_ZERO(tok, array_size) {
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&(${tok}.data[${i}]===0)`;
  }
  return result + ")";
}

function IS_NONZERO(tok, array_size) {
  let result = "(false";
  for (let i = 0; i < array_size; i++) {
    result += `||(${tok}.data[${i}]!==0)`;
  }
  return result + ")";
}

function BITS_SET_IN_ARRAY(tok, arr, array_size) {
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&((${tok}.data[${i}] & ${arr}[${i}]) === ${tok}.data[${i}])`;
  }
  return result + ")";
}

function NOT_BITS_SET_IN_ARRAY(tok, arr, array_size) {
  let result = "(false";
  for (let i = 0; i < array_size; i++) {
    result += `||((${tok}.data[${i}] & ${arr}[${i}]) !== ${tok}.data[${i}])`;
  }
  return result + ")";
}

function BITS_CLEAR_IN_ARRAY(tok, arr, array_size) {
  if (array_size === 0) return "true";
  let result = "(true";
  for (let i = 0; i < array_size; i++) {
    result += `&&((${tok}.data[${i}] & ${arr}.data[${i}]) === 0)`;
  }
  return result + ")";
}

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

// this function is used to unroll loops in parallel from bitvec - it returns a string
// representation of the javascript unrolled code
function UNROLL(command, array_size) {
  const toks = command.split(" ");
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += `${toks[0]}.data[${i}] ${toks[1]} ${toks[2]}.data[${i}];\n`;
  }
  return result;
}

function UNROLL_TOK_REAL(tok, op, val, array_size) {
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += tok + ".data[" + i + "]" + op + val.data[i] + ";\n";
  }
  return result;
}

function LEVEL_GET_CELL_INTO(level, index, targetarray, OBJECT_SIZE) {
  let result = "";
  for (let i = 0; i < OBJECT_SIZE; i++) {
    result +=
      targetarray +
      `.data[${i}]=level.objects[${index}*${OBJECT_SIZE}+${i}];\n`;
  }
  return result;
}

function LEVEL_GET_MOVEMENTS_INTO(index, targetarray, MOVEMENT_SIZE) {
  let result = "";
  for (let i = 0; i < MOVEMENT_SIZE; i++) {
    result +=
      targetarray +
      `.data[${i}]=level.movements[${index}*${MOVEMENT_SIZE}+${i}];\n`;
  }
  return result;
}

function LEVEL_SET_CELL(level, index, vec, array_size) {
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += `\t${level}.objects[${index}*${array_size}+${i}]=${vec}.data[${i}];\n`;
  }
  return result;
}

function IMPORT_COMPILE_TIME_ARRAY(runtime, compiletime, array_size) {
  let result = "";
  for (let i = 0; i < array_size; i++) {
    result += `${runtime}.data[${i}]=${compiletime.data[i]};\n`;
  }
  return result;
}
