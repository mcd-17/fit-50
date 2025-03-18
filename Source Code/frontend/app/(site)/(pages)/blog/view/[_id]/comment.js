import Image from 'next/image';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Avatar, Input, message, Tooltip } from 'antd';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { UserOutlined } from '@ant-design/icons';
import { postComments, deleteComments } from '../../../../../helpers/backend';
import Button from '../../../../../../components/common/button';
import { useI18n } from '../../../../../providers/i18n';
import { useUser } from '../../../../../contexts/user';
import { useActionConfirm } from '../../../../../helpers/hooks';


const CommentSection = ({ commentsList, blogId, getData }) => {
  const { user } = useUser();
  const i18n = useI18n();
  const [comments, setComments] = useState(commentsList || []);
  const [newComment, setNewComment] = useState("");
  const [commentsToShow, setCommentsToShow] = useState(4);

  useEffect(() => {
    setComments(commentsList);
  }, [commentsList]);
  const handleShowMore = () => {
    setCommentsToShow(prevCount => prevCount + 4);
  };
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await postComments({ blog: blogId, content: newComment });
        if (response && !response.error) {
          getData({ _id: blogId });
          message.success(i18n?.t('Comment added successfully'));
        } else {
          message.error(response?.msg);
        }
      } catch (error) {
        message.error(i18n?.t('Something went wrong'));
      }
    }
  };

  const deleteComment = async (_id) => {
    await useActionConfirm(deleteComments, { _id: _id }, () => {
      getData({ _id: blogId });
    })
  };

  return (
    <div className='rounded-md bg-white p-4 shadow-lg'>
      <h1 className='text-2xl font-semibold'>{i18n?.t('Comments')}</h1>
      <div className='mt-4 space-y-4'>
        {comments?.slice(0, commentsToShow)?.map((comment) => (
          <>
            <div
              key={comment?.id}
              className='flex w-full justify-between rounded-md bg-gray-100 p-4'
            >
              <div className='flex items-start space-x-4 p-4'>
                <div className='h-[50px] w-[50px]'>
                  {comment?.user?.image ? (
                    <Image
                      src={comment?.user?.image}
                      alt='image'
                      height={50}
                      width={50}
                      className='h-full w-full rounded-full'
                    />
                  ) : (
                    <Avatar
                      size='large'
                      icon={<UserOutlined />}
                      className='flex-shrink-0'
                    />
                  )}
                </div>
                <div>
                  <div className='flex items-center space-x-2'>
                    <span className='font-semibold text-gray-700'>
                      {comment?.user?.name}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {moment(comment?.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className='text-gray-600'>{comment?.content}</p>
                </div>
              </div>
              {user?.role === 'admin' && (
                <div className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full duration-300 hover:border hover:shadow-xl'>
                  <Tooltip
                    color='white'
                    placement='bottom'
                    title={
                      <p
                        onClick={() => deleteComment(comment?._id)}
                        className='cursor-pointer text-black'
                      >
                        {i18n?.t('Delete')}
                      </p>
                    }
                  >
                    <BiDotsVerticalRounded className='text-2xl font-bold text-gray-500' />
                  </Tooltip>
                </div>
              )}

            </div>

          </>
        ))}
      </div>
      <div className="flex justify-between">
        {commentsToShow < comments?.length && (
          <div className='text-center mt-4'>
            <Button type='primary' onClick={handleShowMore}>
              {i18n?.t('Show More')}
            </Button>
          </div>
        )}

        {
          commentsToShow > 4 && (
            <div className='text-center mt-4'>
              <Button type='primary' onClick={() => setCommentsToShow(4)}>
                {i18n?.t('Show Less')}
              </Button>
            </div>
          )
        }
      </div>
      <div className='mt-8'>
        <Input.TextArea
          rows={4}
          placeholder={i18n?.t('Write your comment...')}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type='primary' className='mt-2' onClick={handleAddComment}>
          {i18n?.t('Submit')}
        </Button>
      </div>
    </div>
  );
};

export default CommentSection
