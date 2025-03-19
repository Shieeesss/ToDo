import axios from "./axiosInstance";
import Cookies from "js-cookie";

interface AuthResponse {
  token: string;
}

const setAuthToken = (token: string) => {
  Cookies.set("auth_token", token, { expires: 7 }); // Store token in cookies
};

const removeAuthToken = () => {
  Cookies.remove("auth_token"); // Remove token from cookies
};

const getAuthToken = (): string | undefined => {
  return Cookies.get("auth_token"); // Retrieve token from cookies
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post<AuthResponse>("/auth/login", { email, password });

    if (response.data.token) {
      setAuthToken(response.data.token); // Store token in cookies
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 422) {
        const errorMessage = error.response.data.error;
        if (errorMessage.email) {
          throw new Error(errorMessage.email[0]);
        } else if (errorMessage.password) {
          throw new Error(errorMessage.password[0]);
        }
      } else if (error.response.status === 500) {
        throw new Error("Internal server error. Please try again later.");
      }
    }
    console.error("Login failed:", error);
    throw new Error("Login failed, please try again.");
  }
};

export const register = async (
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  // Check if passwords match
  if (password !== passwordConfirmation) {
    throw new Error("Passwords do not match");
  }

  try {
    // Send the correct password_confirmation value to the backend
    const response = await axios.post<AuthResponse>("/auth/register", { 
      first_name,
      last_name,
      email, 
      password, // Send the password
      password_confirmation: passwordConfirmation // Send the confirmation password
    });

    // Check if the response contains a token
    if (response.data.token) {
      setAuthToken(response.data.token); // Store token in cookies
    }

    return response.data; // Return the data if successful
  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      throw new Error("Validation failed: " + error.response.data.message);
    }
    console.error("Registration failed:", error);
    throw new Error("Registration failed User exist, please login again.");
  }
};

export const logout = () => {
  removeAuthToken(); // Remove token from cookies
};

export const fetchUserData = async (): Promise<any> => {
  const token = getAuthToken(); // Retrieve token from cookies

  if (!token) {
    throw new Error("No token found, please log in.");
  }

  try {
    const response = await axios.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`, // Send the token in Authorization header
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data.");
  }
};

export const fetchTodos = async (): Promise<any> => {
  try {
    const response = await axios.get("/todos");
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "An unexpected error occurred.");
  }
};

export const createTodo = async (todo: { title: string; description?: string; deadline: string; date: string; is_completed?: boolean }): Promise<any> => {
  try {
    const response = await axios.post("/todos", { ...todo, is_completed: todo.is_completed ?? false });
    return response.data;
  } catch (error: any) {
    console.error("Error creating todo:", error.response?.data || error.message);
    throw new Error("Failed to create todo: " + JSON.stringify(error.response?.data || error.message));
  }
};

export const updateTodo = async (
  id: number,
  updates: { title?: string; description?: string; is_completed?: boolean; deadline: string; date: string }
): Promise<any> => {
  try {
    const response = await axios.put(`/todos/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error);
    throw new Error("Failed to update todo.");
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/todos/${id}`);
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.error("Todo not found:", error.response.data);
      throw new Error("Todo not found: " + JSON.stringify(error.response.data));
    }
    console.error("Error deleting todo:", error.response?.data || error.message);
    throw new Error("Failed to delete todo: " + JSON.stringify(error.response?.data || error.message));
  }
};