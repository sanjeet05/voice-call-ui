import { apiCalls } from "./apiCalls";

const base_api_url = process.env.REACT_APP_BASE_API_URL || "http://localhost:3100";

export const doPlivoCall = async (values) => {
  const url = base_api_url + `/api/v1/voice/plivo_call`;
  try {
    const result = await apiCalls("post", url, values);
    return result.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    } else {
      console.error("voice call, server err:", error.message);
      throw new Error(error.message);
    }
  }
};
