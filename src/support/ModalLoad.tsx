import React from 'react';
import {SafeAreaView, StyleSheet, Image} from 'react-native';
import {Modal} from 'native-base';
const ModalLoad = ({viewed = true}) => {
  return (
    <Modal isOpen={viewed}>
      <SafeAreaView style={styles_modal.principal}>
        <Image
          style={{
            width: 250,
            height: 250,
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
