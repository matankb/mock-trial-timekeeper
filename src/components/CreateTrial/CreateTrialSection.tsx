import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface CreateTrialSectionProps {
  title: string;
  color: string;
  children: React.ReactNode;
}

const CreateTrialSection: FC<CreateTrialSectionProps> = ({
  title,
  color,
  children,
}) => {
  const headerStyles = {
    ...styles.header,
    backgroundColor: color,
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingLeft: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingRight: 10,
  },
  headerText: {
    fontSize: 16,
    paddingTop: 10,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: 'white',
  },
});

export default CreateTrialSection;
