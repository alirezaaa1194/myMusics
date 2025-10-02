export async function getMe(token: string) {
  const res = await fetch(`${process.env.URL}/api/auth/me`, {
    headers: {
      authorization: token,
    },
  });
  const data = await res.json();

  return data.user;
}
