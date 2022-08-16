const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function RandomString(n: number): string {
  let result = "";
  const charactersLength = alphabet.length;
  for (var i = 0; i < n; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function RandomNumber(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min;
}

export { RandomNumber, RandomString };
