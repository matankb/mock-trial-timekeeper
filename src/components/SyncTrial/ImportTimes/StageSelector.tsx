import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { Picker } from '@react-native-picker/picker';
import React, {
  FC,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { getStageName } from '../../../constants/trial-stages';
import LinkButton from '../../LinkButton';
import Text from '../../Text';

interface StageSelectorProps {
  stage: string;
  stages: string[];
  handleStageChange: (stage: string) => void;
}

const StageSelector: FC<StageSelectorProps> = ({
  stage,
  stages,
  handleStageChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    setSelectedStage(stage);
  }, [stage]);

  const handleOpen = () => {
    setOpen(true);
    bottomSheetRef.current?.present();
  };

  const handleClose = () => {
    setOpen(false);
    bottomSheetRef.current?.dismiss();
  };

  const handleSelect = () => {
    handleStageChange(selectedStage);
    handleClose();
  };

  return (
    <>
      <TouchableOpacity style={styles.dropdown} onPress={handleOpen}>
        <Text style={{ fontStyle: stage ? 'normal' : 'italic' }}>
          {stage ? getStageName(stage) : 'Select Stage'}
        </Text>
      </TouchableOpacity>

      {open && (
        <Portal>
          <Pressable style={styles.background} onPress={handleClose} />
        </Portal>
      )}

      <View style={styles.bottomSheetWrap}>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          style={{ zIndex: 1000 }}
          containerStyle={{ paddingBottom: -16 }}
          snapPoints={['40%']}
          enableDismissOnClose
        >
          <View style={styles.pickerWrap}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                paddingRight: 10,
                marginTop: -10,
                // paddingBottom: 10,
              }}
            >
              <LinkButton onPress={handleSelect} title="Select" />
            </View>
            <Picker
              selectedValue={selectedStage}
              onValueChange={(value) => {
                setSelectedStage(value);
              }}
              style={styles.picker}
              itemStyle={{ height: '100%', marginTop: -16 }}
            >
              {stages.map((stage) => (
                <Picker.Item
                  label={getStageName(stage)}
                  value={stage}
                  key={stage}
                />
              ))}
            </Picker>
          </View>
        </BottomSheetModal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#dddddd',
    borderRadius: 5,
    padding: 3,
    paddingHorizontal: 8,
  },
  pickerWrap: {
    height: '100%',
  },
  picker: {
    height: '100%',
  },
  background: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
    opacity: 0.5,
    position: 'absolute',
  },
  bottomSheetWrap: {
    zIndex: 100,
  },
});

export default StageSelector;
