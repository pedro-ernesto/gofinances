import React, {useContext, useState} from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Alert, ActivityIndicator, Platform } from "react-native";
import {useTheme} from 'styled-components';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from "../../hooks/auth";

import { SignInSocialButton } from "../../Components/SignInSocialButton";


import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';

export function SingIn(){
  const [isLoading, setIsLoading] = useState(false);
  const {signInWithGoogle,signInWithApple} = useAuth();
  const theme = useTheme();
  
  async function handleSignInGoogle(){
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error:any) {
      Alert.alert('Deu ruim');
      console.log(error);
      setIsLoading(false);
    } 
  }

  async function handleSignInApple(){
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error:any) {
      Alert.alert('Deu ruim');
      console.log(error);
      setIsLoading(false);
    } 
  }


  return(
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg width={RFValue(120)} height={RFValue(68)}/>
          <Title>
            Controle suas {'\n'} finanças de forma {'\n'} muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'} uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton 
          title = "Entrar com Google"
          svg={GoogleSvg}
          onPress={handleSignInGoogle}
          />
          {
            Platform.OS === 'ios' &&
            <SignInSocialButton 
            title = "Entrar com Apple"
            svg={AppleSvg}
            onPress={signInWithApple}/>
          }
        </FooterWrapper>

        {isLoading && <ActivityIndicator color ={theme.colors.shape} style={{marginTop:18}}/>}
      </Footer>
    </Container>
  )
}