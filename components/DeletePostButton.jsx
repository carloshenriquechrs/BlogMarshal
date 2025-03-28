import { deleteDoc, doc } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/firebase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const DeletePostButton = ({ postId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "posts", postId));
      toast.success("Post deleted successfully!");
      router.push("/"); 
    } catch (error) {
      toast.error("Error deleting post");
    }finally {
        setLoading(false);
      }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <Button variant="destructive" disabled={loading}>
          {loading ? <Loader2 className="animate-spin size-5" /> : "Delete Post"}
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. The post will be permanently deleted.</AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} variant="secondary">Cancel</AlertDialogCancel>
          <AlertDialogAction className={buttonVariants({variant:'destructive'})} disabled={loading} onClick={handleDelete}>
            {loading ? <Loader2 className="animate-spin size-5" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostButton;
