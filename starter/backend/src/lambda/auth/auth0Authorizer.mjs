import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
const certificate = '-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJGtv631mrgNAzMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1vcXBoOGNkaHZnb2oyNmk2LnVzLmF1dGgwLmNvbTAeFw0yNDExMjQw
OTM5MzNaFw0zODA4MDMwOTM5MzNaMCwxKjAoBgNVBAMTIWRldi1vcXBoOGNkaHZn
b2oyNmk2LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANeon3xC4fh7+WprCaIL5aB5g2odD/1Gsrd+bVIiMFgI9JKDnxnErKB6swR3
pp9MKsqwYhI0QK1n/gSkhfxg0QuAoK8UmfWe3GqtoVzsV6MtobLq43LFF4rMW/hW
uLS/6esDy7SZRu+Xs8VkGQqbxVvtHBoIsWTc2+GfGbaokBqvA6IdxUiYJxselO7/
vxcFJ3qDI6EYXm4aPSsnuDY8tSYcjtuOISP+ANIuMhQl87W3DLaAvcXMmAcQpIC8
7HjMtWGP65GTsBC8q8CcxxTNaIXjqwesY6D1aYXaezZCvyUNTiT2ZMya+jeM+cMO
j5cCuNvEYzhxsPPKioHIOCME2u0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUFJ31eMyC2Sw87nLa+smjdu81IGwwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBF9t9cxjYRqqu9aMPOrptDge8jaxj6UMwcpvXiA6gN
nHpAvfmCd4l2OEfmnG/KQve50UjwKj4FeAFpDRWsOqknCPiuKk1lXl2UdTXgNITf
HCizhlg3YJPd3dDdeioUgNzpnukTS1popE+bAlkhxCPE3oMTYVIAXCxzZafW9+lb
QgHksds+fHemUmGp93dZD0LOPsJFTys1u/vZwy+Kf1PwHazS2OOnl9AyQGikjpaO
wnUUW7xWsBy3h3P+7tad+Sc4G4+fJ6K5kmzlW1n+nlvgIYUsrL5Y+2A4KXHGe06k
BgzhvkCGJP/Z+BRVIOwI+Ic91Gd4Q5jXgcKS8WSLUVY4
-----END CERTIFICATE-----'

const jwksUrl = 'https://dev-oqph8cdhvgoj26i6.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })
  
  return jsonwebtoken.verify(token,certificate,{ algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
