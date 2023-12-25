import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CardProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

const Card = (props: CardProps) => {
  return (
    <View
      style={{
        ...styles.container,
        ...props.style,
      }}
    >
      {props.children}
    </View>
  );
};

const styles = {
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
};

export default Card;
