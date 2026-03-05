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

import colors from '../../../constants/colors';

interface AddTeamProps {
  onAdd: (teamName: string) => void;
}

const AddTeam = ({ onAdd }: AddTeamProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleAddPress = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'New Team Name',
        "Enter the name of the new team, such as 'A Team', 'B Team', etc.",
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Add',
            onPress: (name?: string) => {
              if (!name?.trim()) {
                return;
              }
              onAdd(name);
            },
          },
        ],
      );
    } else {
      setModalVisible(true);
    }
  };

  const handleModalSubmit = () => {
    if (!teamName.trim()) {
      return;
    }
    onAdd(teamName);
    setTeamName('');
    setModalVisible(false);
  };

  const androidAddDialog = (
    <Dialog.Container visible={modalVisible}>
      <Dialog.Title style={{ color: 'black' }}>New Team Name</Dialog.Title>
      <Dialog.Description>
        Enter the name of the new team, such as &apos;A Team&apos;, &apos;B
        Team&apos;, etc.
      </Dialog.Description>
      <Dialog.Input
        value={teamName}
        onChangeText={setTeamName}
        style={styles.androidInput}
      />
      <Dialog.Button
        label="Cancel"
        onPress={() => {
          setModalVisible(false);
          setTeamName('');
        }}
      />
      <Dialog.Button label="Add" onPress={handleModalSubmit} />
    </Dialog.Container>
  );

  return (
    <>
      <TouchableOpacity onPress={handleAddPress} style={styles.addTeamButton}>
        <MaterialIcons name="add" size={20} color={colors.BLUE} />
        <Text style={styles.addTeamText}>Add another team</Text>
      </TouchableOpacity>
      {androidAddDialog}
    </>
  );
};

const styles = StyleSheet.create({
  addTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  addTeamText: {
    color: colors.BLUE,
    fontSize: 16,
    marginLeft: 8,
  },
  androidInput: {
    color: 'black',
  },
});

export default AddTeam;
