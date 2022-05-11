import Image from 'next/image';
import Date from './date';
import { useRouter } from 'next/router'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useState } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const myLoader = ({ src }) => {
  return src;
};

export const Pod = ({ pod, languages, removePod }) => {
  const router = useRouter()
  const [hide, setHide] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postId = e.target.postId.value;
    const createdBy = e.target.createdBy.value;
    const languageId = e.target.languageId.value;
    const client = new ApolloClient({
      uri: apiUrl,
      cache: new InMemoryCache()
    });
  
    const pods = await client.mutate({
      mutation: gql`
        mutation addLanguagePost(
          $postId: String
          $languageId: String
          $createdBy: String
        ) {
          addLanguagePost(
            postId: $postId
            languageId: $languageId
            createdBy: $createdBy
          )
        }
      `,
      variables: {
        postId: postId,
        languageId: languageId,
        createdBy: createdBy
      }
    });
    console.log(pods);
    if(pods.data.addLanguagePost) {
      setHide(true)
      removePod(postId)
    }
    // router.reload();
  }
  return (
    <>
      {!hide && (
      <div className='flex items-center justify-between p-6 space-x-6 border-2 rounded-xl my-3 mx-1'>
        <div className='flex-1'>
          <div className='flex items-center space-x-3'>
            <span className='inline-flex items-center'>
              <span className='font-bold text-md mx-1'>{` @${pod.createdBy.username}:`}</span>
            </span>
            <h3 className='text-gray-900 text-md font-medium truncate uppercase'>
              {pod.title}
            </h3>
          </div>
          <div className='flex pt-4'>
            <audio controls src={pod.audioByteUrl}>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </div>
          <div className='flex pt-2'>
            <span className="text-sm text-muted">{Date(pod.createdAt)}</span>
          </div>
        </div>
        <div className='inline-flex pt-4'>
          <form className='flex-1' onSubmit={handleSubmit} method='post'>
            <input type='hidden' name='postId' value={pod.id} />
            <input type='hidden' name='createdBy' value={pod.createdBy.id} />
            <select
              id='language'
              name='languageId'
              className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
              defaultValue=''
              required
            >
              <option value='' disabled>
                Select language
              </option>
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
            <button
              className='mt-3 w-full px-6 py-3 text-base font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:shadow-outline sm:text-sm'
              type='submit'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      )}
    </>
  );
};
