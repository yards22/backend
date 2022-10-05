const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
function RandomString(n: number): string {
  let result = "";
  const charactersLength = alphabet.length;
  for (var i = 0; i < n; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function RandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function GenerateOTP(): string {
  let otp: string = "";
  while (otp.length < 4) {
    const RandNumber = Math.floor(Math.random() * 10);
    otp +=
      RandNumber !== 0 ? RandNumber.toString() : (RandNumber + 1).toString();
  }
  return otp;
}

export { RandomNumber, RandomString, GenerateOTP };
