import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase";

const usePosts = (userId = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let postsQuery = query(collection(db, "posts"), orderBy("created_At", "desc"));

        // If a userId is provided, filter posts by userId
        if (userId) {
          postsQuery = query(collection(db, "posts"), where("userId", "==", userId), orderBy("created_At", "desc"));
        }

        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch user info (imageUrl)
        const postsWithUserInfo = await Promise.all(
          postsData.map(async (post) => {
            const userRef = doc(db, "users", post.userId);
            const userSnap = await getDoc(userRef);
            return {
              ...post,
              userImageUrl: userSnap.exists() ? userSnap.data().imageUrl || "" : "",
              userName: userSnap.exists() ? userSnap.data().name || "Unknown" : "Unknown",
            };
          })
        );

        setPosts(postsWithUserInfo);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]); // Refetch when userId changes

  return { posts, loading };
};

export default usePosts;
