import Head from 'next/head';
import { Pod } from '../components/pod';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export async function getServerSideProps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(apiUrl);
  const client = new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache()
  });

  const pods = await client.query({
    query: gql`
      query getNonLanguageTaggedPosts {
        getNonLanguageTaggedPosts {
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
    `
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
  return {
    props: {
      pods: pods.data.getNonLanguageTaggedPosts,
      languages: languages.data.languages
    }
  };
}

export default function Home({ pods, languages }) {
  return (
    <div>
      <Head>
        <title>VoicePods</title>
      </Head>

      <main>
        <label className='mx-auto my-2'>List of voicepods without language tagged.</label>
        {pods.map((pod) => (
          <Pod key={pod.id} pod={pod} languages={languages} />
        ))}
      </main>
    </div>
  );
}
