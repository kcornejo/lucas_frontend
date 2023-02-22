import React, {useState} from 'react';
import {styles} from './Styles';
import {TextInput, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Controller} from 'react-hook-form';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const InputKC = ({
  control,
  icon,
  placeholder,
  name,
  error,
  rules,
  secureTextEntry,
  keyboardType = 'default',
  date = false,
  setValue,
}) => {
  const [dateString, setDateString] = useState(new Date('2000'));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    if (date) {
      setDatePickerVisibility(true);
    }
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = dateR => {
    setValue(
      name,
      dateR.getDate() +
        '/' +
        (dateR.getMonth() + 1) +
        '/' +
        dateR.getFullYear(),
    );
    setDateString(dateR);
    hideDatePicker();
  };
  return (
    <View>
      {date ? (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={dateString}
        />
      ) : null}

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
                keyboardType={keyboardType}
                onFocus={showDatePicker}
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
