import jwt from 'jsonwebtoken'
import "dotenv/config";
//access
export function createAccessToken(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: '30m'})
    return accessToken
}

//refresh
export function createRefreshToken(payload) {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: '14d'})
    return refreshToken
}