import getToken from "./getToken";

export async function signUpPOST(credentials) {
  try {
    const response = await fetch(
      "https://optaend.prathamsk.me/api/v1/users/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error("Sign up failed");
      error.status = response.status;
      error.info = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
}

export async function loginPOST(credentials) {
  const response = await fetch(
    "https://optaend.prathamsk.me/api/v1/users/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) {
    const errorInfo = await response.json();
    const error = new Error("Login failed");
    error.status = response.status;
    error.info = errorInfo;
    console.log(error);
    throw error;
  }

  return response.json();
}

export async function saveAddress(data) {
  try {
    console.log(data);
    const token = getToken();
    let auth;
    if (token) {
      auth = `Bearer ${token}`;
    } else {
      auth = " ";
    }

    const response = await fetch(
      `https://optaend.prathamsk.me/api/v1/address/saveAddress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorInfo = await response.json();
      const error = new Error("An error occurred while fetching bookings");
      error.status = response.status;
      error.info = errorInfo;
      console.log(error);
      throw error;
    }
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCurrentAddress() {
  const token = getToken();
  let auth;
  if (token) {
    auth = `Bearer ${token}`;
  } else {
    auth = " ";
  }

  const response = await fetch(
    `https://optaend.prathamsk.me/api/v1/address/getCurrentAddress`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${auth}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorInfo = await response.json();
    const error = new Error("An error occurred while fetching bookings");
    error.status = response.status;
    error.info = errorInfo;
    throw error;
  }
  const result = await response.json();

  return result;
}

export async function fetchSavedLocations() {
  const token = getToken();
  let auth;
  if (token) {
    auth = `Bearer ${token}`;
  } else {
    auth = " ";
  }

  const response = await fetch(
    `https://optaend.prathamsk.me/api/v1/address/getSavedAddresses`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${auth}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorInfo = await response.json();
    const error = new Error("An error occurred while fetching bookings");
    error.status = response.status;
    error.info = errorInfo;
    throw error;
  }
  const result = await response.json();

  return result;
}

export async function getAddressDetails(id) {
  const token = getToken();
  let auth;
  if (token) {
    auth = `Bearer ${token}`;
  } else {
    auth = " ";
  }

  const response = await fetch(
    `https://optaend.prathamsk.me/api/v1/address/getAddressDetails/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${auth}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorInfo = await response.json();
    const error = new Error("An error occurred while fetching bookings");
    error.status = response.status;
    error.info = errorInfo;
    throw error;
  }
  const result = await response.json();

  return result;
}
export async function updateAddress(id, data) {
  try {
    const token = getToken();
    let auth;
    if (token) {
      auth = `Bearer ${token}`;
    } else {
      auth = " ";
    }

    const response = await fetch(
      `https://optaend.prathamsk.me/api/v1/address/updateAddress/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorInfo = await response.json();
      const error = new Error("An error occurred while updating the address");
      error.status = response.status;
      error.info = errorInfo;
      throw error;
    }
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error during address update:", error);
    throw error;
  }
}
export async function deleteAddress(id) {
  try {
    const token = getToken();
    let auth;
    if (token) {
      auth = `Bearer ${token}`;
    } else {
      auth = " ";
    }

    const response = await fetch(
      `https://optaend.prathamsk.me/api/v1/address/deleteAddress/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorInfo = await response.json();
      const error = new Error("An error occurred while deleting the address");
      error.status = response.status;
      error.info = errorInfo;
      throw error;
    }

    return { message: "Address deleted successfully" };
  } catch (error) {
    console.error("Error during address deletion:", error);
    throw error;
  }
}