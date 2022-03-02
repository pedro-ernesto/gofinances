import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from "victory-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";

import { HistoryCard } from "../../Components/HistoryCard";

import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { categories } from "../../utils/categories";
import { RFValue } from "react-native-responsive-fontsize";


import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,

 } from "./styles";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";


interface TransactionData {
  transactionType: 'up' | 'down';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: string;
  totalNumber: number;
  color: string;
  percent: string;
}

 export function Resume(){

  const [totalByCategories, settotalByCategories] = useState<CategoryData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const {signOut,user} = useAuth();
  const dataKey = `@gofinances:transactions_user:${user.id}`;
  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev'){
    if(action ==='next'){ 
      const newDate = addMonths(selectedDate,1);
      setSelectedDate(newDate);
    }else{
      const newDate = subMonths(selectedDate,1);
      setSelectedDate(newDate);
    }

  }

  async function loadData(){
    setIsLoading(true);
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];
    const expenses = responseFormatted
    .filter((expenses: TransactionData) => 
    expenses.transactionType === 'down' &&
    new Date(expenses.date).getMonth() === selectedDate.getMonth() &&
    new Date(expenses.date).getFullYear() === selectedDate.getFullYear()
    );

    const totalExpenses = expenses.reduce((accumulator: number,expense: TransactionData)=>{
      return accumulator + Number(expense.amount);
    },0)

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category=>{
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key){
          categorySum += Number(expense.amount);
        }
      });

      if (categorySum > 0){
        const total = categorySum
        .toLocaleString('pt-BR',{
          style:'currency',
          currency: 'BRL'
        });

        const percent = `${(categorySum / totalExpenses * 100).toFixed(0)}%`

        totalByCategory.push({
          name: category.name,
          total,
          color: category.color,
          key: category.key,
          totalNumber: categorySum,
          percent
        });
      }
    })
    settotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(()=>{
    loadData();
  }, [selectedDate]));

   return(
     <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size = 'large'
          />
        </LoadContainer> : 
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <MonthSelectIcon name ="chevron-left"/>
            </MonthSelectButton>

            <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name ="chevron-right"/>
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              colorScale={totalByCategories.map(category=> category.color)}
              style ={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: 'white',
                }
              }}
              labelRadius={50}
              x="percent"
              y="total"
            />
          </ChartContainer>
          {
            totalByCategories.map(item=>(
              <HistoryCard
              key={item.key}
              title={item.name}
              amount= {item.total}
              color= {item.color}
          />
            ))

        }
        </Content>
      }
     </Container>
   )
 }