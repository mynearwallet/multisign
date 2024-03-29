/**
 * Two-party signature generation for Ed25519.
 * This code allows two parties (a "client" and a "server") to jointly generate
 * an Ed25519 signature under a key that neither one of them possesses in its entirety.
 * The process consists of two phases. During the setup phase,
 * the combined key is generated. During the signing phase, the signature is generated.
 *
 * Setup phase:
 * Both the client and the server generate a regular Ed25519 key pair.
 * The server may use the same key pair for all clients. Then,
 * they exchange their public keys and call addPublicKeys to compute the combined
 * public key. The combined public key is the key under which the signatures will validate.
 *
 * Signing phase:
 * This phase proceeds in three steps.
 * 1. The client calls multiSignStep1. This produces some data that needs to be
 * sent to the server, as well as a secret value that the client should keep locally.
 *
 * 2. The server receives the data from the client and passes it
 * to multiSignStep2. This produces some data that needs to be sent to the client.
 *
 * 3. The client calls multiSignStep3, passing the data from the server as well
 * as the local secret. This produces the signature.
 *
 * See the comments above to specific methods for more details.
 */
import {
  add,
  crypto_hash,
  GE,
  gf,
  gf0,
  modL,
  pack,
  reduce,
  scalarbase,
  unpackneg,
  Z
} from './lib/crypto';

declare const secretTag: unique symbol;
export type Secret = { [secretTag]: true };
export const STEP1_DATA_LEN = 32,
  STEP2_DATA_LEN = 64;

/**
 * Adds two public keys together, producing the combined key. The order of the keys does not matter.
 *
 * @param {Uint8Array} publicKey1 the first key
 * @param {Uint8Array} publicKey2 the second key
 *
 * @returns {Uint8Array | null} the combined key.
 * If the argument values are invalid, returns null or a meaningless value
 */
export function addPublicKeys(
  publicKey1: Uint8Array,
  publicKey2: Uint8Array
): Uint8Array | null {
  let p: GE = [gf(), gf(), gf(), gf()],
    q: GE = [gf(), gf(), gf(), gf()],
    r = new Uint8Array(32);
  if (
    publicKey1.length != 32 ||
    publicKey2.length != 32 ||
    unpackneg(p, publicKey1) ||
    unpackneg(q, publicKey2)
  ) {
    return null;
  }
  add(p, q);
  Z(p[0], gf0, p[0]);
  pack(r, p);
  return r;
}

/**
 * Performs the first step of the two-party signature generation algorithm.
 * This step is performed by the client.
 *
 * @returns {{
 *   data: Uint8Array,
 *   secret: unknown,
 * }}
 *
 * the "data" to be sent to the server. This is always STEP1_DATA_LEN bytes long.
 * the "secret" is an opaque value that the client should keep. This data should be stored IN MEMORY ONLY and only used ONCE.
 */
export function multiSignStep1(
    randombytes: (r: Uint8Array) => void,
): { data: Uint8Array; secret: Secret } {
  let p: GE = [gf(), gf(), gf(), gf()],
    r = new Uint8Array(32),
    s = new Uint8Array(64);
  randombytes(s);
  reduce(s);
  scalarbase(p, s);
  pack(r, p);
  return { data: r, secret: s as unknown as Secret };
}

/**
 * Performs the second step of the two-party signature generation algorithm.
 * This step is performed by the server.
 *
 * @param {Uint8Array} step1data the data produced during step 1. Must be exactly STEP1_DATA_LEN bytes long.
 * @param {Uint8Array} msg the message to sign.
 * @param {Uint8Array} publicKey the combined public key (NOT the server's public key).
 * @param {Uint8Array} secretKey the server's secret key.
 *
 * @returns {Uint8Array|null} the data to be sent to the client. This is always STEP2_DATA_LEN bytes long.
 * If the argument values are invalid, returns null or a meaningless value.
 */
export function multiSignStep2(
  step1data: Uint8Array,
  msg: Uint8Array,
  publicKey: Uint8Array,
  secretKey: Uint8Array,
  randombytes: (r: Uint8Array) => void,
): Uint8Array | null {
  let p: GE = [gf(), gf(), gf(), gf()],
    q: GE = [gf(), gf(), gf(), gf()],
    r = new Uint8Array(64),
    n = msg.length,
    b = new Uint8Array(64 + n),
    h = new Uint8Array(64),
    x = new Float64Array(64);
  if (
    step1data.length != 32 ||
    publicKey.length != 32 ||
    secretKey.length != 64 ||
    unpackneg(p, step1data)
  ) {
    return null;
  }
  Z(p[0], gf0, p[0]);
  Z(p[3], gf0, p[3]);
  randombytes(r);
  reduce(r);
  for (let i = 0; i < 32; i++) x[i] = r[i];
  scalarbase(q, r);
  add(p, q);
  pack(b, p);
  b.set(publicKey, 32);
  b.set(msg, 64);
  crypto_hash(h, b, b.length);
  reduce(h);
  crypto_hash(r, secretKey, 32);
  r[0] &= 248;
  r[31] &= 127;
  r[31] |= 64;
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 32; j++) {
      x[i + j] += h[i] * r[j];
    }
  }
  r.set(b.subarray(0, 32));
  modL(r.subarray(32), x);
  return r;
}

/**
 * Performs the third step of the two-party signature generation algorithm. This step is performed by the client.
 *
 * @param {Uint8Array} step2data the data produced during step 2. Must be exactly STEP2_DATA_LEN bytes long.
 * @param {unknown} secret the value produced during step 1. THIS VALUE MUST NOT BE USED MORE THAN ONCE.
 * @param {Uint8Array} msg the message to sign, must be the same as during step 2.
 * @param {Uint8Array} publicKey the combined public key (NOT the client's public key).
 * @param {Uint8Array} secretKey the client's secret key.
 *
 * @returns {Uint8Array|null} the signature.
 * If the argument values are invalid, returns null or a meaningless value
 */
export function multiSignStep3(
  step2data: Uint8Array,
  secret: Secret,
  msg: Uint8Array,
  publicKey: Uint8Array,
  secretKey: Uint8Array
): Uint8Array | null {
  let n = msg.length,
    b = new Uint8Array(64 + n),
    h = new Uint8Array(64),
    x = new Float64Array(64);
  if (
    step2data.length != 64 ||
    publicKey.length != 32 ||
    secretKey.length != 64
  ) {
    return null;
  }
  b.set(step2data.subarray(0, 32));
  b.set(publicKey, 32);
  b.set(msg, 64);
  crypto_hash(h, b, b.length);
  reduce(h);
  crypto_hash(b, secretKey, 32);
  b[0] &= 248;
  b[31] &= 127;
  b[31] |= 64;
  for (let i = 0; i < 32; i++)
    x[i] = step2data[32 + i] + (secret as unknown as Uint8Array)[i];
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 32; j++) {
      x[i + j] += h[i] * b[j];
    }
  }
  h.set(step2data.subarray(0, 32));
  modL(h.subarray(32), x);
  return h;
}
