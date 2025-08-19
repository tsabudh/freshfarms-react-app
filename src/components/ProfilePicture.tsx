import { useEffect, useState } from "react";
import API_ROUTE from "../assets/globals/baseRoute";

function ProfilePicture({ userId, token }: { userId: string; token: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const uniqueParam = Date.now().toString();
        const res = await fetch(
          `${API_ROUTE}/api/v1/admins/profilePicture/${userId}-profile-picture.webp?${uniqueParam}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Image fetch failed");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      } catch (err) {
        console.error("Failed to fetch image:", err);
      }
    };

    fetchImage();
  }, [userId, token]);

  return imgUrl ? <img src={imgUrl} alt="Profile of user" /> : null;
}

export default ProfilePicture;
