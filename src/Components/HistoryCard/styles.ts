import styled,{css} from "styled-components/native";
import {Feather} from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";

interface ContainerProps {
  color: string;
}

export const Container = styled.View<ContainerProps>`

  width: 100%;
  border-radius: 5px;
  border-left-width: 5px;
  border-left-color: ${({color}) => color};

  background-color: ${({theme}) => theme.colors.shape};

  justify-content: space-between;
  flex-direction: row;

  padding: 13px 24px;

  margin-bottom: 8px;

`;

export const  Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(15)}px;
`;
export const  Amount = styled.Text`
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: ${RFValue(15)}px;
`;