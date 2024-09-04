import jose from 'node-jose';

async function jwtEncryptRequest(
  data,
  keyId,
  publicKeyString,
  privateKeyString
) {
  const privateKey = await jose.JWK.asKey(privateKeyString, 'pem');
  const publicKey = await jose.JWK.asKey(publicKeyString, 'pem');
  let userPayload;

  // 1. Signing the Payload (JWS)
  // 1.1 Convert the JSON payload to string
  try {
    userPayload = JSON.stringify(data); // Convert the JSON payload to a string
  } catch (error) {
    throw new Error(`Error parsing the payload: ${error.message}`);
  }

  // 1.2 Generate a signature using Private Key (JWS)
  if (!keyId) {
    throw new Error('Key ID cannot be empty/undefined');
  }

  const signer = jose.JWS.createSign(
    { fields: { alg: 'RS256', kid: keyId }, format: 'flattened' },
    privateKey
  ).update(userPayload);

  const signedResult = await signer.final();

  // 1.3 Serialize the Signature (JWS) to JSON Format
  const signedJws = {
    payload: signedResult.payload,
    signature: signedResult.signature,
    header: signedResult.protected,
  };

  // 2. Encrypting the Payload (JWE)
  // 2.1 Stringify the JSON payload
  const jwsPayload = JSON.stringify(signedJws);

  // 2.2 Encrypt the Payload using Bank’s Public Key (JWE)
  const encryptHandler = jose.JWE.createEncrypt(
    {
      format: 'flattened',
      contentAlg: 'RSA-OAEP-256',
      fields: {
        enc: 'A256GCM',
        cty: 'JWT',
        kid: keyId,
        alg: 'RSA-OAEP-256',
      },
      protect: ['kid', 'enc', 'cty', 'alg'],
    },
    publicKey
  ).update(jwsPayload);

  const encryptedResult = await encryptHandler.final();

  // 2.3 Serialize the Encrypted Payload (JWE) to JSON Format
  const encryptedJWE = {
    header: encryptedResult.protected,
    encryptedKey: encryptedResult.encrypted_key,
    iv: encryptedResult.iv,
    encryptedPayload: encryptedResult.ciphertext,
    tag: encryptedResult.tag,
  };

  return encryptedJWE;
}

export { jwtEncryptRequest };;
