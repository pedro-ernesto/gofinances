import React, {useContext} from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Alert } from "react-native";

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
  const {signInWithGoogle,signInWithApple} = useAuth()
  
  async function handleSignInGoogle(){
    try {
      await signInWithGoogle();
    } catch (error:any) {
      Alert.alert('Deu ruim');
      console.log(error);
    }
  }

  async function handleSignInApple(){
    try {
      await signInWithApple();
    } catch (error:any) {
      Alert.alert('Deu ruim');
      console.log(error);
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
          <SignInSocialButton 
          title = "Entrar com Apple"
          svg={AppleSvg}
          onPress={signInWithApple}/>
        </FooterWrapper>
      </Footer>
    </Container>
  )
}