import { gql } from '@apollo/client'

export const GET_ME = gql`
  query singleUser {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        link
        image
      }
    }
  }
`;