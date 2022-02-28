import React, {useState} from "react";
import { Keyboard, Modal, 
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup'

import { useForm } from "react-hook-form";

import { Button } from "../../Components/Forms/Button";
import { Input } from "../../Components/Forms/Input";
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
  const {
    control,
    handleSubmit,
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

  function handleRegister (form: FormData) {
    console.log(form);
    if(!transactionType)
      return Alert.alert('Selecione transação')

    if(category.key === 'category')
     return Alert.alert('Selecione categoria')


    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }
    console.log(data);
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