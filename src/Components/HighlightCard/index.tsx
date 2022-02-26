import React from "react";

import { 
  
  Container,
  Header,
  Title, 
  Icon,
  Footer, 
  Amount,
  LastTransaction,
  
} from "./styles";

export function HighlightCard(){
  return (
    <Container>
      <Header>
        <Title>Entrada</Title>
        <Icon name= "arrow-up-circle"/>
      </Header>

      <Footer>
        <Amount>
          7500
        </Amount>
        <LastTransaction>
          13 de abril
        </LastTransaction>
      </Footer>
    </Container>
  )
}