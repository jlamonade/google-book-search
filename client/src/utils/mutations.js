import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation ($bookId: ID) {
    deleteBook(bookId: $bookId) {
      _id
      username
      savedBooks
    }
  }
`