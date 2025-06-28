import { useState } from "react";

type PendingStatus = "static" | "sending" | "success" | "failure";

interface UseAPIProps<B> {
  url: string;
  jwtToken: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | string;
  addedHeaders?: Record<string, string>;
  body?: B;
}

interface APIResponse<D> {
  status: "success" | "failure";
  data?: D;
  message?: string;
  errors?: { msg: string }[];
}

async function requestAPI<D, B>(props: {
  url: string;
  method: string;
  jwtToken: string;
  body?: B;
  addedHeaders?: Record<string, string>;
}): Promise<APIResponse<D>> {
  const { url, method, jwtToken, body, addedHeaders } = props;

  // Set headers, defaulting to JSON unless overridden
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
    ...addedHeaders,
  };

  // Remove Content-Type if body is FormData (browser sets it automatically)
  if (body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(url, {
    method,
    headers,
    body:
      method !== "GET" && method !== "HEAD"
        ? body instanceof FormData
          ? body
          : JSON.stringify(body)
        : undefined,
  });

  const json = await response.json();
  return json;
}

/**
 * Custom hook to perform API requests with built-in loading, error and data states.
 * Exposes sendRequest and allows dynamic request body via setRequestBody.
 */
function useAPI<D, B>(props: UseAPIProps<B>) {
  const { url, jwtToken, method, addedHeaders, body: initialBody } = props;

  const [pendingStatus, setPendingStatus] = useState<PendingStatus>("static");
  const [data, setData] = useState<D | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestBody, setRequestBody] = useState<B | undefined>(initialBody);

  /**
   * Sends the API request using either an override body or current requestBody state.
   * Updates loading status and error accordingly.
   */
  const sendRequest = async (overrideBody?: B) => {
    setPendingStatus("sending");
    setErrorMessage(null);

    try {
      const bodyToSend = overrideBody ?? requestBody;
      const responseObject = await requestAPI<D, B>({
        url,
        method,
        jwtToken,
        body: bodyToSend,
        addedHeaders,
      });

      if (responseObject.status === "success") {
        setData(responseObject.data ?? null);
        setPendingStatus("success");
      } else {
        setErrorMessage(
          responseObject.message ??
            responseObject.errors?.[0].msg ??
            "Unknown error"
        );
        setPendingStatus("failure");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Network error");
        setPendingStatus("failure");
      } else throw error; 
    }
  };

  return [
    pendingStatus,
    data,
    errorMessage,
    sendRequest,
    setRequestBody,
  ] as const;
}

export default useAPI;
