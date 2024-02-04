import { CommentWithChildren } from '~/server/schemas/schemas'
import formComments from '../../comment/formatComments'
import { Card } from '~/components/ui/card';
import { X } from 'lucide-react';
import { useParams } from '@remix-run/react';
import { P } from '~/components/ui/typography';
import AvatarWithOptions from '~/components/avatar-with-options';



const CommentList = ({ comments }: {
    comments: CommentWithChildren[]
}) => {
    const postId = useParams().postId
    console.log(postId, 'postId from list comments');
    if(!postId) return null
    console.log(comments, 'comments from list comments');
    // loop through the comments array and if a comment doesn't have children then return the comment and if it does then return the comment and the children commen

  // This function filters the comments by postId and then filters out the comments that have a parentId.
  function filterComments(comments: CommentWithChildren[], postId: string) {
    return comments
      ?.filter((comment: { postId: string }) => comment.postId === postId)
      .filter((comment) => !comment.parentId)
  }
        const filteredComments = filterComments(comments, postId)

    if (!filteredComments) return null

    console.log(filteredComments, 'filtered comments from list comments');


    return (

        <>
            {filteredComments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </>
    )
}

export default CommentList



const Comment = ({ comment,depth=1 }: { comment: CommentWithChildren, depth?:number }) => {
    return (
          <div className={`pl-${depth * 4} border-2 ml-${depth * 2} mt-2 flex flex-col py-1 md:py-2`}>

      <P className="mt-1 bg-secondary rounded-md p-1 md:p-2">{comment.message}</P>
      {comment?.children?.map(child => (
        <Comment key={child.id} comment={child} depth={depth + 1} />
      )) }
             <AvatarWithOptions
            user={comment.user}
        />
        <div>
          <p className="text-xs font-semibold">{comment.user.username}</p>
          <p className="text-xs">{new Date(comment.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    )
}