import React from "react";  
import { HighlightCard } from "../../Components/HighlightCard";
 
import { 
  Container, Header,
  UserInfo, Photo,
  User, UserName,
  UserGreeting, UserWrapper,
  Icon,HighlightCards

 } from "./styles";

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source= {{ uri: 'https://avatars.githubusercontent.com/u/63816957?s=400&u=7e5e69132bbe0c2f5257475741998fec7cd7266b&v=4'}}/>
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Pedro</UserName>
            </User>
          </UserInfo>

          <Icon name="power"/>
        </UserWrapper>

      </Header>

      <HighlightCards >
        <HighlightCard title = "Entradas" 
        amount = "R$ 17.400,00" 
        lastTransaction="Última entrada dia 13 de abril"
        type="up" />
        <HighlightCard title = "Saídas" 
        amount = "R$ 1.259,00" 
        lastTransaction="Última saída dia 03 de abril"
        type="down" />      
        <HighlightCard title = "Total" 
        amount = "R$ 16.141,00" 
        lastTransaction="01 à 16 de abril"
        type="total" />
      </HighlightCards>
    </Container>
  )
}