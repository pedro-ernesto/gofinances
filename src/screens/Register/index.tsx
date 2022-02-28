import React, {useState, useEffect} from "react";
import { Keyboard, Modal, 
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../../Components/Forms/Button";
import { InputForm } from "../../Components/Forms/InputForm";
import { TransactionTypeButton } from "../../Components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../Components/Forms/CategorySelectButton";

import { CategorySelect } from "../CategorySelect";

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,

 } from "./styles";

 interface FormData {
   [name: string]:any;
 }

 type NavigationProps = {
  navigate:(screen:string) => void;
}

 const schema = Yup.object().shape({
   name: Yup.string().required('Nome obrigatório'),
   amount: Yup
   .number()
   .typeError('Digite um número válido')
   .positive('Digite um valor positivo')
   
 });


export function Register () {

  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const dataKey = '@gofinances:transactions';
  const navigation = useNavigation<NavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(schema)
  });


  const [category, setCategory ] = useState({
    key: 'category',
    name: 'Categoria',
  });

  function handleTransactionTypeSelect (type: 'up' | 'down') {
    setTransactionType(type);
  }

  async function handleRegister (form: FormData) {
    if(!transactionType)
      return Alert.alert('Selecione transação')

    if(category.key === 'category')
     return Alert.alert('Selecione categoria')


    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date()
    }
    try {

      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');

    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  }

  function handleCloseSelectCategoryModal () {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal () {
    setCategoryModalOpen(true);
  }
  
  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm 
              placeholder="Nome"
              control = {control}
              name = 'name'
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
              />
            <InputForm 
              placeholder="Preço"
              control = {control}
              name = 'amount'
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
              />
            <TransactionTypes>
            <TransactionTypeButton
              type = 'up'
              title= 'Income'
              isActive = {transactionType === 'up'}
              onPress={() => handleTransactionTypeSelect ('up')}
            />
            <TransactionTypeButton
              type = 'down'
              title= 'Outcome'
              isActive = {transactionType === 'down'}
              onPress={() => handleTransactionTypeSelect ('down')}
            />
            </TransactionTypes>

            <CategorySelectButton
              title = {category.name}
              onPress = {handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button 
          title = "Enviar"
          onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible = {categoryModalOpen}>
          <CategorySelect
            category = {category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>

      </Container>
    </TouchableWithoutFeedback>
  )
}