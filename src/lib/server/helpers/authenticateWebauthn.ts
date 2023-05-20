import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server'
import type { AuthenticationResponseJSON, PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/typescript-types'
import { serverEnv } from '../serverEnv'
import type { Authenticator, User } from '$lib/db/schema/users'

export function initializeAuthentication(user: User & { authenticators: Authenticator[] }) {
    const options = generateAuthenticationOptions({
        // Require users to use a previously-registered authenticator
        allowCredentials: user ? user.authenticators.map(authenticator => ({
            id: base64StringToUint8Array(authenticator.credentialID),
            type: 'public-key',
            // Optional
            // transports: authenticator.transports as AuthenticatorTransportFuture[],
        })) : [],
        userVerification: 'preferred',
    })

    return options
}

export async function finalizeAuthentication(options: PublicKeyCredentialRequestOptionsJSON, attestation: AuthenticationResponseJSON, user: User & { authenticators: Authenticator[] }) {
    const verification = await verifyAuthenticationResponse({
        response: attestation,
        expectedChallenge: options.challenge,
        expectedOrigin: serverEnv.APP_URL,
        expectedRPID: serverEnv.RPID,
        authenticator: {
            credentialID: base64StringToUint8Array(user.authenticators[0].credentialID),
            credentialPublicKey: base64StringToUint8Array(user.authenticators[0].credentialPublicKey!),
            counter: Number(user.authenticators[0].counter),
        },
        requireUserVerification: true,
    })

    const { verified, authenticationInfo } = verification

    if (!verified) return false

    if (!authenticationInfo) return false

    // TODO: Update the counter in the database
    // const authenticatorUpdateCount = await prisma.authenticator.update({
    //     where: {
    //         credentialID: uint8ArrayToBase64String(authenticationInfo!.credentialID)
    //     },
    //     data: {
    //         counter: authenticationInfo!.newCounter
    //     }
    // });

    return true
}

function base64StringToUint8Array(base64String: string) {
    return Buffer.from(base64String, 'base64url')
}
