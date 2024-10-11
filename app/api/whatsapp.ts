import axios from "axios";
const BASE_URL = "http://localhost:5000";

export const sendWhatsAppMessages = async (
  formData: FormData
): Promise<void> => {
  try {
    const response = await axios.post(`${BASE_URL}/send-messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.status);
    if (response.status !== 200) {
      throw new Error("Failed to send messages");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
