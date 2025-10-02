"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type signupInitialValue = {
  values: {
    username: string;
    email: string;
    password: string;
  };
  message: string;
};

type loginInitialValue = {
  values: {
    email: string;
    password: string;
  };
  message: string;
};

export async function signup(
  state: signupInitialValue,
  payload: {
    username: string;
    email: string;
    password: string;
  }
) {
  if (!(payload.username && payload.username.length > 3) || !payload.email || !(payload.password && payload.password.length > 7)) {
    return { values: payload, message: "Please enter correct credentials!" };
  }

  const response = await fetch(`${process.env.URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (response.status === 409) {
    return { ...state, message: result.message };
  } else if (response.status === 201) {
    const cookiesStore = await cookies();
    const expireTime = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    cookiesStore.set({ name: "accessToken", value: result.accessToken, httpOnly: true, path: "/", maxAge: Number(expireTime) });
    redirect("/");
  }

  return { values: payload, message: "" };
}

export async function login(
  state: loginInitialValue,
  payload: {
    email: string;
    password: string;
  }
) {
  if (!payload.email || !(payload.password && payload.password.length > 7)) {
    return { values: payload, message: "Please enter correct credentials!" };
  }

  const response = await fetch(`${process.env.URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (response.status === 201) {
    const cookiesStore = await cookies();
    const expireTime = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    cookiesStore.set({ name: "accessToken", value: result.accessToken, httpOnly: true, path: "/", maxAge: Number(expireTime) });
    redirect("/");
  } else {
    return { ...state, message: result.message };
  }
}

export async function logout() {
  const cookiesStore = await cookies();
  cookiesStore.delete("accessToken");
  redirect("/login");
}
