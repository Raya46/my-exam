// useLogin.js
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';

export const useLogin = () => {
  const navigation = useNavigation();
  const [fields, setFields] = useState({
    name: ''.toLowerCase(),
    token: '',
    password: '',
  });

  const saveTokenRole = async (token, role, name) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('role', role);
    await AsyncStorage.setItem('name', name);
  };

  const login = async (url, page) => {
    try {
      const response = await axios.post(url, fields);
      const token = response.data.token;
      const role = response.data.message;
      await saveTokenRole(token, role, fields.name);
  
      setFields({
        name: '',
        token: '',
        password: '',
      });
      navigation.replace(page, { name: fields.name });
    } catch (error) {
      if (error.response) {
        console.log(error.message, error.response.data.message);
        ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
      } else {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    }
  };
  

  return { fields, setFields, login };
};
