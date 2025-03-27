import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

const usePostById = () => {
  const { id } = useParams(); // Get document ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, "posts", id);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = postSnap.data();

          // Fetch user data
          const userRef = doc(db, "users", postData.userId);
          const userSnap = await getDoc(userRef);

          setPost({
            id: id,
            ...postData,
            userName: userSnap.exists() ? userSnap.data().name || "Unknown" : "Unknown",
            userImageUrl: userSnap.exists() ? userSnap.data().imageUrl || "" : "",
          });
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading };
};

export default usePostById;
