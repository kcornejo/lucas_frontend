import React from 'react';
import {Modal, Pressable, SafeAreaView, Text} from 'react-native';
import {styles} from '../Styles';
const RegisterWeights = ({setVisible, visible = false}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView>
        <Pressable
          style={styles.button}
          onPress={() => {
            setVisible(false);
          }}>
          <Text style={styles.textButton}>Regresar</Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};
export default RegisterWeights;
