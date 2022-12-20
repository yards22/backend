const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// this function checks the integrity of the googleIdToken and outputs the user data
export default function verifyGoogleIdTokenAndGetUserData(
  googleIdToken: string
) {
  return new Promise((resolve, reject) => {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    return client
      .verifyIdToken({
        idToken: googleIdToken,
        audience: GOOGLE_CLIENT_ID,
      })
      .then((ticket: any) => {
        // the integrity of the google id token has been confirmed and obtained data in payload
        const payload = ticket.getPayload();
        // returning the user data obtained in the payload
        return resolve(payload);
      })
      .catch((err: any) => {
        // integrity check failed or the user has logged out

        // sending the error as unauthorized with status code 401
        return reject(err);
      });
  });
}
