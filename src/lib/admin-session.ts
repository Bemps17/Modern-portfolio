import {
  createLocalReq,
  generatePayloadCookie,
  getFieldsToSign,
  jwtSign,
  type Payload,
  type TypedUser,
} from 'payload'
import { addSessionToUser } from 'payload/shared'

type MintSessionArgs = {
  payload: Payload
  user: TypedUser & { email?: string | null }
}

/**
 * Émet un cookie de session Payload sans mot de passe (appareil de confiance).
 */
export async function mintPayloadAdminSession({ payload, user }: MintSessionArgs): Promise<string> {
  const collectionConfig = payload.collections.users.config
  const email = typeof user.email === 'string' ? user.email : ''
  const req = await createLocalReq({ user }, payload)

  let sid: string | undefined
  if (collectionConfig.auth.useSessions) {
    const session = await addSessionToUser({
      collectionConfig,
      payload,
      req,
      user: user as never,
    })
    sid = session.sid
  }

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email,
    sid,
    user: user as never,
  })

  const { token } = await jwtSign({
    fieldsToSign,
    secret: payload.secret,
    tokenExpiration: collectionConfig.auth.tokenExpiration,
  })

  return generatePayloadCookie({
    collectionAuthConfig: collectionConfig.auth,
    cookiePrefix: payload.config.cookiePrefix,
    token,
  })
}
