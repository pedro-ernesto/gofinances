import React from "react";  
import { HighlightCard } from "../../Components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../Components/TransactionCard";

import { 
  Container, Header,
  UserInfo, Photo,
  User, UserName,
  UserGreeting, UserWrapper,
  Icon,HighlightCards,
  Title,
  Transactions,
  TransactionsList

 } from "./styles";

export interface DataListProps extends TransactionCardProps{
   id: string;
 }

export function Dashboard() {

  const data: DataListProps[] = [{
    id: '1',
    type: 'up',
    title:"Desenvolvimento de site",
    amount:"R$ 12.000,00",
    date:"13/04/2020",
    category:{
      name: 'Vendas',
      icon: 'dollar-sign'
    }
  },
  {
    id: '2',
    type: 'down',
    title:"Hamburgueria Pizzy",
    amount:"R$ 59,00",
    date:"13/04/2020",
    category:{
      name: 'Alimentação',
      icon: 'coffee'
    }
  },
  {
    id: '3',
    type: 'down',
    title:"Aluguel do apartamento",
    amount:"R$ 1.200,00",
    date:"27/03/2020",
    category:{
      name: 'Casa',
      icon: 'shopping-bag'
    }
  },
]

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

      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList 
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => <TransactionCard data = {item}/>}
        />
      </Transactions>
    </Container>
  )
}