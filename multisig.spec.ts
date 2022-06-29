import nacl from 'tweetnacl';
import {
    addPublicKeys,
    multiSignStep1,
    multiSignStep2,
    multiSignStep3
} from './server';

describe('', function () {
    it('', () => {
        const message = new Uint8Array([42, 42, 42]);

        // @ts-ignore
        const kp1 = nacl.sign.keyPair();
        // @ts-ignore
        const kp2 = nacl.sign.keyPair();

        const combinedKey = addPublicKeys(
            kp1.publicKey,
            kp2.publicKey,
        );

        if (combinedKey === null) {
            throw new Error('Combined key should not to be null');
        }

        const step1 = multiSignStep1();
        const step2 = multiSignStep2(
            step1.data,
            message,
            combinedKey,
            kp2.secretKey
        );

        if (step2 === null) {
            throw new Error('Step2 should not to be null');
        }

        const signature = multiSignStep3(
            step2,
            step1.secret,
            message,
            combinedKey,
            kp1.secretKey
        );

        if (signature === null) {
            throw new Error('Signature should not to be null');
        }

        // @ts-ignore
        const nacltest = nacl.sign.detached.verify(
            message,
            signature,
            combinedKey
        );
        expect(nacltest).toBe(true)
    })
});
