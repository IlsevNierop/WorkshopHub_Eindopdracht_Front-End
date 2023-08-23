import jwt_decode from "jwt-decode";
export function checkTokenValidity(token) {
    const decodedToken = jwt_decode(token);
    const expirationTime = decodedToken.exp * 1000;

    return Date.now() < expirationTime;
}