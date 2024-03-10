import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
    username
    email
    bookCount
    savedBooks {
      _id
      authors
      bookId
      description
      image
      link
      title
    }
  }
  }
`;


export const  SingleUser = gql`
    query user($username: String!) {
        user(username: $username) {
            _id
            username
            email
            bookCount
        }
    }
    `;