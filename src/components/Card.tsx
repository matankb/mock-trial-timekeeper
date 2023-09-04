import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

const Card = (props: CardProps) => {
  return (
    <View
      style={{
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        // paddingTop: 0,
        marginTop: 10,
        alignSelf: 'center',
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

export default Card;
