import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server'
import type { RegistrationResponseJSON, PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types'
import { serverEnv } from '$lib/server/serverEnv'
import type { Authenticator, User } from '$lib/db/schema/users'

export function initializeRegister(user: User & { authenticators: Authenticator[] }) {
    const options = generateRegistrationOptions({
        rpName: serverEnv.RPNAME,
        rpID: serverEnv.RPID,
        userID: user.id.toString(),
        userName: user.email,
        // userDisplayName: email, // maybe?
        // Don't prompt users for additional information about the authenticator
        // (Recommended for smoother UX)
        attestationType: 'none',
        // Prevent users from re-registering existing authenticators
        excludeCredentials: user.authenticators.map(authenticator => ({
            id: base64StringToUint8Array(authenticator.credentialID),
            type: 'public-key',
        })),
        authenticatorSelection: {
            residentKey: 'required',
            userVerification: 'preferred',
        }
    })

    return options
}

export async function finalizeRegister(attestation: RegistrationResponseJSON, options: PublicKeyCredentialCreationOptionsJSON) {
    const verification = await verifyRegistrationResponse({
        response: attestation,
        expectedChallenge: options.challenge,
        expectedOrigin: serverEnv.APP_URL,
        expectedRPID: serverEnv.RPID,
        requireUserVerification: true,
    })
    
    const { verified, registrationInfo } = verification
    
    if (!verified) return false
    
    if (!registrationInfo) return false

    return verification
}

function base64StringToUint8Array(base64String: string) {
    return Buffer.from(base64String, 'base64url')
}