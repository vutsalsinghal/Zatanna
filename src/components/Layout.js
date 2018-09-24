import React from 'react';
import {Container} from 'semantic-ui-react';
import Header from './Header';

export default props => {
  return (
    <Container>
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
      <Header />
      {props.children}
    </Container>
  );
};