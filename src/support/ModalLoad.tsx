import React from 'react';
import {Modal, SafeAreaView, StyleSheet, Image} from 'react-native';

const ModalLoad = ({viewed = true}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={viewed}>
      <SafeAreaView style={styles_modal.principal}>
        <Image
          style={{
            width: 150,
            height: 150,
          }}
          source={require('../resources/images/loading.gif')}
        />
      </SafeAreaView>
    </Modal>
  );
};
const styles_modal = StyleSheet.create({
  principal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ModalLoad;
