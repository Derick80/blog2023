import { ChatBubbleIcon, ChevronUpIcon, HeartIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { Popover, Transition } from '@headlessui/react';
import { Float } from "@headlessui-float/react";

import { Icon } from '@radix-ui/react-select';
import { useFetcher, useLoaderData, useLocation } from '@remix-run/react';
import { ChevronDownIcon, ChevronsDownUp, DeleteIcon, Link, MoreVerticalIcon, ReplyIcon } from 'lucide-react';
import React, { Fragment } from 'react';
import { isAdding, isProcessing } from '~/components/form-submit-state';
import { LoggedIn } from '~/components/logged-in';
import Editor from '~/components/tiptap/editor';
import TipTap from '~/components/tiptap/tip-tap';
import { cn } from '~/lib/utils';
import { UserPlaceHolder } from '~/resources/user-placeholder';
import { loader } from '~/routes/blog_.drafts_.$postId';
import { useRootLoaderData } from '~/utilities';
import { LoggedOut } from '../logged-out';

export function Comments({ comments }: { comments: Comment[] | null }) {
   const { user } = useRootLoaderData();

   const { post } = useLoaderData<typeof loader>();

   let location = useLocation();

   return (
      <>
         <div className="mx-auto max-w-[728px] max-tablet:px-3 laptop:w-[728px] py-6 laptop:pb-40">
            <LoggedIn>
               <div className="pb-5">
             {/* <Editor

               postId={ post.id } /> */}
               </div>
            </LoggedIn>
            {comments && comments.length > 0 ? (
               comments.map((comment, index) => (
                  <CommentRow
                     key={comment?.id}
                     userId={user?.id}
                     comment={comment}
                     comments={comments}
                     topLevelIndex={index}
                     postId={post.id}

                  />
               ))
            ) : (
               <LoggedOut>
                  <div>
                     <div className="mb-5 text-sm pl-4 border-l-2 border-color-sub">
                        <Link
                           className="underline font-bold pr-1 hover:text-blue-500"
                           to={`/login?redirectTo=${location.pathname}`}
                        >
                           Login
                        </Link>
                        <span className="text-1">to leave a comment...</span>
                     </div>
                 <CommentsEditor

                   postId={ post.id } />
                  </div>
               </LoggedOut>
            )}
         </div>
      </>
   );
}

function CommentRow({
   comment,
   comments,
   userId,
   isNested,
   topLevelIndex,
   postId,
}: {
   comment: Comment;
   comments: Comment[];
   userId: string | undefined;
   isNested?: Boolean;
   topLevelIndex?: number;
   postId: string;
}) {
   const [isReplyOpen, setReplyOpen] = React.useState(false);
   const [isCommentExpanded, setCommentExpanded] = React.useState(true);

   const fetcher = useFetcher({ key: "comments" });

   //Hide the comment field after submission
   React.useEffect(
      function resetFormOnSuccess() {
         //@ts-ignore
         if (fetcher.state === "idle" && fetcher.data?.message == "ok") {
            return setReplyOpen(false);
         }
      },
      [fetcher.state, fetcher.data],
   );


   return (
      <>
         <div
            className={cn(
               isNested
                  ? `relative before:content-[''] before:absolute before:left-3
         before:dark:bg-zinc-700 before:bg-[#ededed] before:-z-0 before:h-full before:w-[1px] rounded-full`
                  : "mb-3",
            )}
         >
            <div className="flex items-center gap-2 relative">
               <div
                  className="dark:border-zinc-600 bg-zinc-50 border dark:bg-zinc-700 justify-center shadow-sm shadow-1
                        flex h-6 w-6 flex-none items-center overflow-hidden rounded-full"
               >
                  {comment.user?.imageUrl ? (
                     <img
                        width={50}
                        height={50}
                   alt="Avatar"
                   className='aspect-auto w-20 h-20 '
                        src={comment.user.imageUrl ?? ""}
                     />
                  ) : (
                     <UserPlaceHolder className="text-sm mx-auto " />
                  )}
               </div>
               <div
                  className={cn(
                          "text-sm font-bold underline underline-offset-2 dark:decoration-zinc-600 decoration-zinc-300",
                  )}
               >
                  { comment.user.username}
               </div>
               <span className="w-1 h-1 bg-zinc-500 rounded-full" />
               <div className="text-xs text-1">
                  {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                     month: "short",
                     day: "numeric",
                     hour: "numeric",
                     minute: "numeric",
                     timeZone: "America/Los_Angeles",
                  })}
               </div>
            </div>
            <div
               className={cn(
                  !isNested
                     ? `relative before:content-[''] before:absolute before:left-0 rounded-full
                     before:dark:bg-zinc-700 before:bg-[#ededed] before:-z-0 before:h-full before:w-[1px]`
                     : "",
                  "mb-4 ml-3 pl-5 relative",
               )}
            >
               {comment?.replies && comment?.replies?.length > 0 && (
                  <button
                     onClick={() => setCommentExpanded(!isCommentExpanded)}
                     className="absolute -left-[8.5px] bottom-0 bg-zinc-100 dark:bg-dark450 border shadow-sm shadow-1
                   dark:border-zinc-600 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  >
                     {isCommentExpanded ? (
                        <ChevronUpIcon  />
                     ) : (
                        <ChevronDownIcon   />
                     )}
                  </button>
               )}
               <div className="pt-2.5">
             { comment.message && <div
               dangerouslySetInnerHTML={ {
                  __html: comment.message,
                }

               } /> }
               </div>
               <div className="pt-3 flex items-center">
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() =>
                           fetcher.submit(
                              //@ts-ignore
                              {
                                 commentId: comment?.id,
                                 userId,
                                 intent: "like-comment",
                              },
                              { method: "post" },
                           )
                        }
                        className="border shadow-sm shadow-emerald-100 dark:shadow-emerald-950/50 active:border-emerald-300 group
                        hover:dark:border-emerald-600/70 dark:hover:bg-emerald-950 border-emerald-300/60 bg-emerald-50/50 hover:bg-emerald-50 dark:bg-emerald-950/10
                      dark:border-emerald-700/50 w-5 h-5 rounded-md flex items-center justify-center dark:active:border-emerald-600"
                     >
                        <HeartIcon
                           className="text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"

                        />
                     </button>

                  </div>
                  <LoggedIn>
                     <span className="w-1 h-1 dark:bg-zinc-600 bg-zinc-300 rounded-full mx-3" />
                     <button
                        onClick={() => setReplyOpen(!isReplyOpen)}
                        className="shadow-sm dark:shadow-zinc-800 flex items-center gap-0.5 border dark:border-zinc-600/50 mr-1
                     dark:hover:border-zinc-500/50 rounded-full dark:bg-dark350 pl-1 pr-2.5 bg-zinc-50 hover:border-zinc-300"
                     >
                        <div className="w-5 h-5 rounded text-1 flex items-center justify-center">
                           {isReplyOpen ? (
                              <ChevronsDownUp  />
                           ) : (
                       <ReplyIcon
                       />
                           )}
                        </div>
                        <div className="text-[10px] font-bold">Reply</div>
                     </button>
                     <Popover>
                        {({ open }) => (
                           <>
                              <Float
                                 as={Fragment}
                                 enter="transition ease-out duration-200"
                                 enterFrom="opacity-0 translate-y-1"
                                 enterTo="opacity-100 translate-y-0"
                                 leave="transition ease-in duration-150"
                                 leaveFrom="opacity-100 translate-y-0"
                                 leaveTo="opacity-0 translate-y-1"
                                 placement="bottom-end"
                                 offset={7}
                              >
                                 <Popover.Button className="flex focus:outline-none items-center text-zinc-400 dark:text-zinc-500 justify-center rounded-full w-5 h-5">
                                    {open ? (
                                       <ChevronUpIcon
                                       />
                                    ) : (
                                       <MoreVerticalIcon />
                                    )}
                                 </Popover.Button>
                                 <Popover.Panel
                                    className="border-color-sub justify-items-center text-1 bg-3-sub shadow-1
                                       gap-1 z-30 rounded-lg border p-1 shadow-sm"
                                 >
                                    {userId === comment?.user?.id && (
                                       <button
                                          className="hover:dark:bg-zinc-700 hover:bg-zinc-100 rounded p-1.5"
                                          onClick={() =>
                                             fetcher.submit(
                                                {
                                                   commentId: comment.id,
                                                   intent: "delete-comment",
                                                },
                                                { method: "post" },
                                             )
                                          }
                                       >
                                          <DeleteIcon


                                          />
                                       </button>
                                    )}
                                 </Popover.Panel>
                              </Float>
                           </>
                        )}
                     </Popover>
                  </LoggedIn>
               </div>
            </div>
            <Transition
               show={isReplyOpen}
               enter="transition ease-out duration-100"
               enterFrom="opacity-0 translate-y-1"
               enterTo="opacity-100 translate-y-0"
               leave="transition ease-in duration-50"
               leaveFrom="opacity-100 translate-y-0"
               leaveTo="opacity-0 translate-y-1"
            >
               <div className="pb-5 pl-8">
                  <CommentsEditor
                     isReply
                     commentParentId={comment.id}
                     //@ts-ignore
                     commentDepth={comment.depth}
                     postId={postId}
                  />
               </div>
            </Transition>
            {comment?.replies && comment?.replies?.length > 0 && (
               <Transition
                  show={isCommentExpanded}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
               >
                  <div className="pl-7">
                     {comment?.replies?.map((comment, index) => (
                        <CommentRow
                           key={comment.id}
                           userId={userId}
                           comment={comment}
                           comments={comments}
                           topLevelIndex={topLevelIndex}
                           postId={postId}
                           isNested
                        />
                     ))}
                  </div>
               </Transition>
            )}
         </div>
         {!isNested && (
            <div className="border-t border-color border-dashed w-full mt-3 mb-4 ml-3" />
         )}
      </>
   );
}

export function CommentHeader({
   totalComments,
}: {
   totalComments: number | undefined;
}) {
   return (
      <div
         id="comments"
         className="border-y overflow-hidden border-color bg-zinc-50 shadow-sm dark:shadow dark:bg-dark350/70 relative w-full rounded-md"
      >
         <div
            className="flex items-center justify-between gap-1.5 font-bold py-3
            mx-auto pb-3"
         >
            <div className="flex items-center gap-2">
               <ChatBubbleIcon
                  name="message-circle"
                  className="text-zinc-400 dark:text-zinc-500"

               />
               <div className="font-header">
             {
               totalComments !== undefined && totalComments === 0 ? 'No comments' : totalComments === 1 ? '1 comment' : `${totalComments} comments`
                 }
               </div>
            </div>

         </div>
         <div
            className="pattern-dots absolute left-0 top-0.5 -z-0 h-full w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10
            pattern-size-2 dark:pattern-zinc-600 dark:pattern-bg-dark350"
         />
      </div>
   );
}


function CommentsEditor({
   commentParentId,
   commentDepth,
   isReply,
   postId,

}: {
   commentParentId?: string;
   commentDepth?: number;
   isReply?: boolean;
   postId: string;
  }) {
  const [editorContent, setEditorContent] = React.useState<string>('');
   const fetcher = useFetcher({ key: "comments" });
  const creatingTopLevelComment = isAdding(fetcher, "create-top-level-comment");
  const creatingReply = isAdding(fetcher, "create-comment-reply");
  const disabled = isProcessing(fetcher.state)

   function createComment() {
      return fetcher.submit(
         {
            comment: editorContent,
            intent: "create-top-level-comment",
            postId: postId,
         },
         { method: "post" },
      );
   }
   function createCommentReply() {
      return fetcher.submit(
         //@ts-ignore
         {
            comment: editorContent,
            commentParentId,
            postId: postId,
            commentDepth: commentDepth ? commentDepth + 1 : 1,
            intent: "create-comment-reply",
         },
         { method: "post" },
      );
   }

   return (
      <div className="relative bg-2-sub rounded-xl p-4 pb-1 pr-3 border dark:border-zinc-700 dark:focus-within:border-zinc-600 shadow-sm shadow-1">
       <Editor
         content={ editorContent }
         setContent={ setEditorContent }
         postId={ postId }

       />
         <div className="absolute right-3.5 bottom-3.5 flex items-center justify-end">
            <button
               disabled={disabled}
               onClick={() =>
                  isReply ? createCommentReply() : createComment()
               }
               className={cn(
                  disabled ? "dark:bg-zinc-400 " : "",
                  `rounded-full text-white bg-zinc-600 dark:bg-zinc-300
                  dark:text-zinc-700 w-20 py-1.5 text-xs font-bold`,
               )}
            >
               {creatingTopLevelComment || creatingReply ? (
                  <PlusCircledIcon
                     name="loader-2"
                     className="mx-auto h-4 w-4 animate-spin"
                  />
               ) : (
                  "Comment"
               )}
            </button>
         </div>
      </div>
   );
}