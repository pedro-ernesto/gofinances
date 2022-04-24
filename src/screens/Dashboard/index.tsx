import React, { useCallback, useEffect, useState } from "react";  
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  TransactionsList,
  LogoutButton,LoadContainer

 } from "./styles";


export interface DataListProps extends TransactionCardProps{
   id: string;
 }

interface HighlightProps{
  total: string;
  lastTransaction: string;
}

interface HighlightData{
  entries: HighlightProps;
  expenses: HighlightProps;
  result: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data,setData] = useState<DataListProps[]>([]);
  const [highlightData,setHighlightData] = useState<HighlightData>({} as HighlightData);
  const theme = useTheme();
  const {signOut,user} = useAuth();
  const dataKey = `@gofinances:transactions_user:${user.id}`;

  function getLastTransactionDate(collection: DataListProps[],
    type: 'up' | 'down'){

    const collectionFiltered = collection.
    filter(transaction=>transaction.transactionType === type);

    if (collectionFiltered.length === 0)
      return 0;

    const lastTransaction =
    new Date(
    Math.max.apply(Math,collectionFiltered
    .map(transaction => new Date(transaction.date).getTime())
    ));

    return `${lastTransaction.getDate()} de ${lastTransaction
      .toLocaleString('pt-BR', {month: 'long'})}`
  }

  async function loadTransactions(){
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    
    let entriesTotal = 0;
    let expensesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if(item.transactionType === 'up'){
        entriesTotal += Number(item.amount);
      }else{
        expensesTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR',{
        style: 'currency',
        currency: 'BRL'
      })
  
      const date = Intl.DateTimeFormat('pt-BR',{
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        transactionType: item.transactionType,
        category: item.category,
        date,

      }
    });

    setData(transactionsFormatted);

    const lastTransactionEntry = getLastTransactionDate(transactions, 'up');
    const lastTransactionExpenses = getLastTransactionDate(transactions, 'down');
    const interval = lastTransactionExpenses === 0 
    ? 'Não há transações' 
    : `01 a ${lastTransactionExpenses}`

    const result = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        total: entriesTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntry=== 0 
        ? 'Não há transações' 
        : `Última entrada dia ${lastTransactionEntry}`
      },
      expenses: {
        total: expensesTotal.toLocaleString('pt-BR',{
          style: 'currency', 
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpenses === 0 
        ? 'Não há transações' 
        : `Última entrada dia ${lastTransactionExpenses}`
      },
      result: {
        total: result.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: interval
      }
    })
    setIsLoading(false);
  }

  useEffect(() => {
  
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(()=>{
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size = 'large'
          />
        </LoadContainer> : 
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source= {{ uri: user.photo}}/>
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power"/>
              </LogoutButton>
              
            </UserWrapper>

          </Header>

          <HighlightCards >
            <HighlightCard title = "Entradas" 
            amount = {highlightData.entries.total}
            lastTransaction={highlightData.entries.lastTransaction}
            type="up" />
            <HighlightCard title = "Saídas" 
            amount = {highlightData.expenses.total}
            lastTransaction={highlightData.expenses.lastTransaction}
            type="down" />      
            <HighlightCard title = "Total" 
            amount = {highlightData.result.total}
            lastTransaction={highlightData.result.lastTransaction}
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
        </>
      }
    </Container>
  )
}