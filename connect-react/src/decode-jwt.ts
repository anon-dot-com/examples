// Parse a JWT to extract claims.
const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
};

const getSdkClientIdFromIdToken = (token?: string): string => {
  if (!token) {
    return "(none)";
  }

  const { sdkClientId } = parseJwt(token);
  return sdkClientId ?? throw new Error("could not parse sdkClientId from AppUserIdToken");
};

export { getSdkClientIdFromIdToken };
