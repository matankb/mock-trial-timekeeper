import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Dialog from 'react-native-dialog';

import colors from '../../../../constants/colors';

interface AddTournamentProps {
  onAddNewTournament: (name: string) => void;
}

const AddTournament = ({ onAddNewTournament }: AddTournamentProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tournamentName, setTournamentName] = useState('');

  const handleAddPress = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt('Add New Tournament', 'Enter tournament name', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: (name) => {
            if (!name?.trim()) {
              return;
            }
            onAddNewTournament(name);
          },
        },
      ]);
    } else {
      setModalVisible(true);
    }
  };

  const handleModalSubmit = () => {
    if (!tournamentName.trim()) {
      return;
    }
    onAddNewTournament(tournamentName);
    setTournamentName('');
    setModalVisible(false);
  };

  const androidAddDialog = (
    <Dialog.Container visible={modalVisible}>
      <Dialog.Title style={{ color: 'black' }}>Add New Tournament</Dialog.Title>
      <Dialog.Input
        value={tournamentName}
        onChangeText={setTournamentName}
        style={styles.androidInput}
      />
      <Dialog.Button
        label="Cancel"
        onPress={() => {
          setModalVisible(false);
          setTournamentName('');
        }}
      />
      <Dialog.Button label="Add" onPress={handleModalSubmit} />
    </Dialog.Container>
  );

  return (
    <>
      <TouchableOpacity style={styles.addNewButton} onPress={handleAddPress}>
        <MaterialIcons name="add" size={24} color={colors.HEADER_BLUE} />
        <Text style={styles.addNewText}>Add New Tournament</Text>
      </TouchableOpacity>
      {androidAddDialog}
    </>
  );
};

const styles = StyleSheet.create({
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addNewText: {
    marginLeft: 10,
    color: colors.HEADER_BLUE,
    fontSize: 16,
  },
  androidTitle: {
    // in dark mode, the title and background are both white by default
    color: 'black',
  },
  androidInput: {
    color: 'black',
  },
});

export default AddTournament;
