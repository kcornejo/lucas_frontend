import React from 'react';
import {View, Text, SafeAreaView, TextInput} from 'react-native';
import {styles} from './Styles';
import Icon from 'react-native-vector-icons/FontAwesome';
const FillInformation = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#24253d'}}>
      <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
        <Text style={styles.title}>Más Información</Text>
      </View>
      <View style={styles.inputComplete}>
        <Icon name="user" size={30} color="grey" style={styles.inputIcon} />
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="grey"
          style={styles.inputTextIcon}></TextInput>
      </View>
      <View style={styles.inputComplete}>
        <Icon name="user" size={30} color="grey" style={styles.inputIcon} />
        <TextInput
          placeholder="Apellido"
          placeholderTextColor="grey"
          style={styles.inputTextIcon}></TextInput>
      </View>
      <View style={styles.inputComplete}>
        <Icon name="phone" size={30} color="grey" style={styles.inputIcon} />
        <TextInput
          inputMode=""
          placeholder="Telefono"
          placeholderTextColor="grey"
          style={styles.inputTextIcon}></TextInput>
      </View>
      <View style={styles.inputComplete}>
        <Icon name="calendar" size={30} color="grey" style={styles.inputIcon} />
        <TextInput
          placeholder="Fecha de Nacimiento"
          placeholderTextColor="grey"
          style={styles.inputTextIcon}></TextInput>
      </View>
      <View style={styles.inputComplete}>
        <Icon
          name="balance-scale"
          size={30}
          color="grey"
          style={styles.inputIcon}
        />
        <TextInput
          keyboardType="name-phone-pad"
          placeholder="Peso (lbs)"
          placeholderTextColor="grey"
          style={styles.inputTextIcon}></TextInput>
      </View>
      <View style={styles.inputComplete}>
        <Icon name="user" size={30} color="grey" style={styles.inputIcon} />
        <TextInput
          placeholder="Correo"
          placeholderTextColor="grey"
          style={styles.inputTextIcon}></TextInput>
      </View>
      <View style={{flex: 2}}></View>
    </SafeAreaView>
  );
};
export default FillInformation;
