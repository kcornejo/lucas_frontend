import React from 'react';
import {styles} from './Styles';
import {TextInput, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Controller} from 'react-hook-form';
const InputKC = ({
  control,
  icon,
  placeholder,
  name,
  error,
  rules,
  secureTextEntry,
}) => {
  return (
    <View>
      <Controller
        control={control}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <View>
            <View style={styles.inputComplete}>
              <Icon
                name={icon}
                size={30}
                color="grey"
                style={styles.inputIcon}
              />
              <TextInput
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholderTextColor="grey"
                value={value}
                style={styles.inputTextIcon}></TextInput>
            </View>
            <View style={{alignItems: 'center'}}>
              {error && (
                <Text style={{color: 'white', fontWeight: '600'}}>
                  {error?.message}
                </Text>
              )}
            </View>
          </View>
        )}
        name={name}
      />
    </View>
  );
};
export default InputKC;
