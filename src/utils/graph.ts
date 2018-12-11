export async function getUser(token: string) {
  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };
  const graphEndpoint = "https://graph.microsoft.com/beta/me";

  const response = await fetch(graphEndpoint, options);
  const data = await response.json();

  return data;
}

export async function getProfilePhoto(token: string) {
  const headers = new Headers();
  const bearer = "Bearer " + token;
  headers.append("Authorization", bearer);
  const options = {
    method: "GET",
    headers: headers
  };
  const graphEndpoint = "https://graph.microsoft.com/beta/me/photos/24x24/$value";

  const response = await fetch(graphEndpoint, options);
  const data = await response.blob();

  return data;
}