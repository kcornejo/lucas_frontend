import React, {useState} from 'react';
import {Input, Pressable} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
const PasswordKC = props => {
  const [show, setShow] = useState(false);
  return (
    <Input
      rounded={10}
      height={10}
      bgColor={'white'}
      value={props.value}
      type={show ? 'text' : 'password'}
      {...props}
      InputRightElement={
        <Pressable onPress={() => setShow(!show)} pr={3}>
          <Icon name={show ? 'eye-slash' : 'eye'} size={30} color="grey"></Icon>
        </Pressable>
      }
      onChangeText={value => {
        props.setValue(value);
      }}
    />
  );
};

export default PasswordKC;
