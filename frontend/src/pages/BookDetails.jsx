import NotFound from "@/pages/NotFound";
import Heart from "@/components/Heart";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2, Pencil, Star, Trash2 } from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utilities/formatDate";
import useGetBook from "@/hooks/useGetBook";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isLoggedInAtom,
  userAvatarSelector,
  userRoleAtom,
  usersFavouriteBooksAtom,
} from "@/atoms/userData";
import SimilarBooks from "@/components/SimilarBooks";
import { pageTitleAtom } from "@/atoms/meta";
import { toast } from "sonner";
const ReviewList = lazy(() => import("@/components/ReviewList"));
const ReviewForm = lazy(() => import("@/components/ReviewForm"));

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

// ++++++++++++++++++++++++++++++++++++++++++++++++++

// Create new plugin instance

const BookDetails = () => {
  const setPageTitle = useSetRecoilState(pageTitleAtom);
  const userAvatar = useRecoilValue(userAvatarSelector);
  useEffect(() => setPageTitle("Book Details"), []);
  const [isLiked, setisLiked] = useState(false);
  const { book, id, isDetailLoading } = useGetBook();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const role = useRecoilValue(userRoleAtom);
  const [userFavouriteBooks, setUserFavouriteBooks] = useRecoilState(
    usersFavouriteBooksAtom
  );
  const [isHeartLoading, setIsHeartLoading] = useState(false);
  const [myReview, setMyReview] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  console.log(book);
  

  useEffect(() => {
    setisLiked(userFavouriteBooks.includes(book?._id));
  }, [book, userFavouriteBooks]);

  useEffect(() => {
    isLoggedIn &&
      book &&
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/books/${book?._id}/reviews/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setMyReview(response.data);
          setIsEditing(false);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [isLoggedIn, book, counter]);

  const toggleFavorite = async () => {
    if (isLoggedIn) {
      setIsHeartLoading(true);
      axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL}/users/favourites`,
          { bookId: book?._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setIsHeartLoading(false);
          if (isLiked) {
            setUserFavouriteBooks(
              userFavouriteBooks.filter((id) => id !== book._id)
            );
          } else {
            setUserFavouriteBooks([...userFavouriteBooks, book._id]);
          }
        })
        .catch((error) => toast.error(error.response.data.message));
    } else {
      setisLiked(!isLiked);
      toast.error("You need to be logged in");
    }
  };

  const image = book?.image_url.replace("upload/", "upload/w_512/");
  if (isDetailLoading) {
    return (
      <div className="w-full">
        <Loader2 className="mx-auto w-10 h-10 animate-spin" />
      </div>
    );
  } else if (!book) {
    return <NotFound />;
  }
  return (
    <div className="gap-2 grid p-4 sm:p-6 dark:text-zinc-50">
      <div className="flex sm:flex-row flex-col gap-5 m-auto w-full max-w-5xl">
        <div className="sm:top-[81px] sm:sticky flex flex-col items-center pb-2 rounded-lg h-full">
          <img
            width="512px"
            loading="loading..."
            src={image}
            alt="Book cover"
            className="rounded-md min-w-full md:min-w-lg object-cover"
          />
        </div>
        <div className="space-y-2 w-full h-fit">
          <div className="p-4 border-2 border-slate-200 dark:border-zinc-800 rounded-lg w-full h-full">
            <h1 className="mb-5 font-bold text-4xl lg:text-5xl tracking-tight scroll-m-20">
              {book?.title}
            </h1>
            <div className="flex items-end gap-2">
              <h3 className="italic">by</h3>
              <h2 className="font-semibold text-2xl tracking-tight">
                {book?.author}
              </h2>
            </div>
            <div className="flex space-x-4 my-2 py-4 border-slate-200 dark:border-zinc-800 border-t-2 border-b-2 text-sm">
              <div className="pr-4 border-slate-200 dark:border-zinc-800 border-r-2 text-right">
                <h3 className="pb-2 w-24 italic">Year Published</h3>
                <h4 className="font-semibold">{book?.year_published}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <h3 className="w-full italic">Genre</h3>
                {book?.genre?.map((genre, index) => (
                  <Badge variant="outline" key={index}>
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            {book?.description && (
              <div>
                <h3 className="font-semibold text-xl tracking-tight">
                  Description
                </h3>
                <blockquote className="my-4 border-slate-200 dark:border-zinc-800 italic">
                  {book?.description}
                </blockquote>
              </div>
            )}
          </div>

          {isLoggedIn && myReview && (
            <div className="relative flex flex-col mt-4 p-3 sm:p-4 border-2 border-slate-200 dark:border-zinc-800 rounded-md w-full overflow-y-auto">
              <div className="flex items-center gap-2 w-full">
                <img
                  className="shadow-lg rounded-full w-10 sm:w-12 h-10 sm:h-12"
                  src={userAvatar}
                  alt="user"
                />
                <div className="flex flex-col items-start">
                  <h4 className="font-medium text-lg tracking-tight">
                    {myReview.userId.firstName + " " + myReview.userId.lastName}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        size={15}
                        key={index}
                        color={myReview.rating >= index + 1 ? "gold" : "grey"}
                        fill={myReview.rating >= index + 1 ? "gold" : "grey"}
                      />
                    ))}
                    <span className="ml-3 text-gray-500 text-sm">
                      {formatDate(myReview.createdAt)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="top-4 right-2 absolute flex p-2 rounded-full"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Pencil size={20} />
                </Button>
              </div>
              <blockquote className="my-2 sm:my-4 ml-1 text-sm sm:text-base italic">
                {myReview.content}
              </blockquote>
            </div>
          )}
          {(isEditing || !myReview) && (
            <ReviewForm
              book={book}
              isEditing={isEditing}
              reviewId={myReview?._id}
              handleUserReply={() => setCounter(counter + 1)}
            />
          )}
          <div className="flex pb-2">
            <Button
              variant="outline"
              title={isLiked ? "Remove" : "Add"}
              className={`flex mr-2 p-2 md:px-2 gap-2 border-2 ${
                isLiked
                  ? "bg-red-100 hover:bg-red-200/80 border-red-200 dark:border-red-900 dark:hover:bg-red-800/80 dark:bg-red-800/50"
                  : ""
              }`}
              onClick={toggleFavorite}
            >
              {isHeartLoading ? (
                <Loader2
                  color="red"
                  strokeWidth={2.5}
                  opacity={0.5}
                  className="w-8 h-8 animate-spin"
                />
              ) : (
                <Heart isLiked={isLiked} />
              )}
              <span className={role !== "admin" ? "flex" : "hidden md:flex"}>
                {isLiked ? "Added to Favourites" : "Add to Favourites"}
              </span>
            </Button>
            {role === "admin" && (
              <div className="flex sm:justify-end gap-2 w-full">
                <Button
                  title="Edit Book"
                  variant="outline"
                  className="border-2 border-slate-300"
                  onClick={() => navigate(`edit`)}
                >
                  <Pencil className="mr-2 w-4 h-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="hover:bg-red-500/90 border-2 border-red-100 hover:border-red-500 text-red-500 hover:text-zinc-50 dark:text-zinc-50"
                    >
                      <Trash2 className="mr-2 w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-11/12">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the Book data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsDeleteLoading(true);
                          let promise = axios.delete(
                            `${import.meta.env.VITE_BACKEND_URL}/books/` + id,
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                  "token"
                                )}`,
                              },
                            }
                          );

                          toast.promise(promise, {
                            loading: "Loading...",
                            success: (response) => {
                              navigate("/books");
                              return response.data.message;
                            },
                            error: (error) => error.response.data.message,
                            finally: () => setIsDeleteLoading(false),
                          });
                        }}
                      >
                        {isDeleteLoading ? (
                          <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Please wait
                          </>
                        ) : (
                          <>Delete</>
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </div>
      <SimilarBooks book={book} />
      <Suspense
        fallback={
          <div className="items-center grid w-full">
            <Loader2 className="mx-auto w-10 h-10 dark:text-zinc-50 animate-spin" />
          </div>
        }
      >
        <PDFViewer url={book.book_url} />
        {/* <PdfViewer url={book.book_url} />; */}
        <ReviewList
          book={book}
          userReplyCounter={counter}
          setUserReplyCounter={setCounter}
        />
      </Suspense>
    </div>
  );
};

const PDFViewer = ({ url }) => {
 

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Google Drive iframe */}
      <iframe
        src={url}
        width="30%"
        
        style={{ border: "none", aspectRatio: "1/1.5" }}
      />
    </div>
  );
};


// const PdfViewer = ({ url }) => {
//   return (
//       <div className="flex flex-col items-center p-4">
//           <h2 className="text-xl font-bold mb-4">React PDF Viewer</h2>
//           <div className="w-full max-w-4xl h-[80vh] border rounded-lg shadow-lg overflow-hidden">
//               <Document file={url}>
//                   <Page pageNumber={1} />
//               </Document>
//           </div>
//       </div>
//   );
// };
  



export default BookDetails;
