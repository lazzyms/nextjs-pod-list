import Head from 'next/head';
import { Pod } from '../components/pod';
import loader from '../components/loader.svg';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pods, setPods] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const client = new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache()
  });
  const getData = async () => {
    setLoading(true);
    const pods = await client.query({
      query: gql`
        query getNonLanguageTaggedPosts($offset: Int, $limit: Int) {
          getNonLanguageTaggedPosts(offset: $offset, limit: $limit) {
            id
            title
            audioByteUrl
            createdBy {
              id
              username
            }
            createdAt
          }
        }
      `,
      variables: {
        offset,
        limit
      }
    });

    const languages = await client.query({
      query: gql`
        query languages {
          languages {
            id
            name
            createdAt
            updatedAt
          }
        }
      `
    });

    return { pods, languages };
  };
  useEffect(() => {
    getData().then((data) => {
      if(data.pods.data.getNonLanguageTaggedPosts.length > 0) {
      setPods([...pods, ...data.pods.data.getNonLanguageTaggedPosts]);
      } else {
        setEnd(true);
      }
      setLanguages(data.languages.data.languages);
      setLoading(false);
    });
  }, [offset, limit]);

  const removePod = (id) => {
    const newPods = pods.filter((pod) => pod.id !== id);
    setPods(newPods);
    if(newPods.length < 5) {
      setOffset(offset + limit);
    }
  }
  if (!languages) return <p>No untagged voicepod found</p>;
  return (
    <div>
      <Head>
        <title>VoicePods</title>
      </Head>

      <main>
        <label className='mx-auto my-2'>
          List of voicepods without language tagged. Page: {(limit+offset)/limit}
        </label>
        {isLoading && offset == 0 ? (
          <div className='flex flex-wrap w-full'>
            <Image
              src={loader}
              width={100}
              height={100}
              className='mx-auto center'
              loading='lazy'
              alt='Loading...'
              placeholder={true}
            />
          </div>
        ) : (
          <>
            {pods.map((pod) => (
            <Pod key={pod.id} pod={pod} languages={languages} removePod={removePod}/>
            ))}
            <div className='flex justify-center'>
              {!isEnd && (
              <button
                className='hover:text-blue-700 text-black font-bold py-2 px-4 rounded-lg'
                onClick={() => setOffset(offset + limit)}
              >
                Load more
                {isLoading && offset > 0 && (
                <Image
                  src={loader}
                  width={20}
                  height={20}
                  className='m-auto center'
                  loading='lazy'
                  alt='Loading...'
                  placeholder={true}
                />
              )}
              </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
