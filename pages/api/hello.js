// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req, res) {
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
      postId: req.body.postId,
      languageId: req.body.languageId,
      createdBy: req.body.createdBy
    }
  });
  console.log(pods);
  res.redirect(307, '/');
  // res.status(200).json('OK');
}
