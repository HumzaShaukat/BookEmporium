import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query me {
    _id
    username
    email
    savedBooks {
      bookId
      authors
      image
      description
      title
      link
    }
  }
`;
