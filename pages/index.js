import Head from 'next/head';
import { Pod } from '../components/pod';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
export default function Home() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [pods, setPods] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isLoading, setLoading] = useState(false);
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
      setPods(data.pods.data.getNonLanguageTaggedPosts);
      setLanguages(data.languages.data.languages);
      setLoading(false);
    });
  }, [offset, limit]);
  if (isLoading) return <p>Loading...</p>;
  if (!languages) return <p>No untagged voicepod found</p>;
  return (
    <div>
      <Head>
        <title>VoicePods</title>
      </Head>

      <main>
        <label className='mx-auto my-2'>
          List of voicepods without language tagged.
        </label>
        {pods.map((pod) => (
          <Pod key={pod.id} pod={pod} languages={languages} />
        ))}
      </main>
    </div>
  );
}
