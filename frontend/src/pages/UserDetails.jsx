import NotFound from "@/pages/NotFound";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { AlertCircle, Heart, Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { pageTitleAtom } from "@/atoms/meta";
import { toast } from "sonner";

const UserDetails = () => {
  const [user, setUser] = useState();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  let { userId } = useParams();
  const setPageTitle = useSetRecoilState(pageTitleAtom);
  useEffect(() => setPageTitle("User Profile"), []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setIsLoading(false));
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="w-full">
        <Loader2 className="mx-auto w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-grow flex-1 items-center col-span-2 mx-auto my-5 p-4 w-full max-w-xl text-center">
      <div className="relative flex flex-col gap-3 p-2 border border-slate-200 dark:border-zinc-800 rounded-lg w-full h-fit">
        <div className="flex flex-col justify-center items-center gap-4 px-auto py-10 border-slate-200 dark:border-zinc-800 border-b text-center">
          <img
            className="-top-20 absolute bg-slate-50 dark:bg-zinc-950 shadow-lg p-3 border-2 border-slate-200 dark:border-zinc-800 rounded-full w-32 h-32"
            // src={user.picture || `https://robohash.org/${user._id}.png`}
            src={user.picture || ` https://api.dicebear.com/9.x/big-smile/svg?seed=${user._id}`}
            alt="user"
          />
          <div className="flex flex-col justify-center">
            <h5
              title={user?.firstName + " " + user?.lastName}
              className="mb-1 w-full font-medium text-gray-900 dark:text-zinc-50 text-3xl sm:text-4xl truncate">
              {user?.firstName} {user?.lastName}
            </h5>
            <span
              title={user?.email}
              className="w-full text-gray-500 text-2xl sm:text-3xl truncate">
              {user?.email}
            </span>
          </div>
          <div className="">
            <Badge variant="outline" className="ml-auto text-lg">
              {user?.role}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 dark:text-zinc-50/60">
          <div className="flex flex-col items-center">
            <span className="flex justify-center items-center gap-1 text-base">
              <span>
                {user?.likedComments?.length + user?.likedReviews?.length}
              </span>
              <Heart size={18} />
            </span>
            <span>Likes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex justify-center items-center gap-1 text-base">
              <span>{user?.reportedBy?.length}</span> <AlertCircle size={18} />
            </span>
            <span>Reports</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex justify-center items-center gap-1 text-base">
              <span>{user?.favoriteBooks?.length}</span> <Star size={18} />
            </span>
            <span>Favourites</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
