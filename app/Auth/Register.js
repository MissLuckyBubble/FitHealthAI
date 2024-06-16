// components/Register.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  FlatList,
  Picker,
} from 'react-native';
import { styles } from '../../styles/styles';
import useFetch from '../../hooks/useFetch';

const dietaryOptions = [
  { label: 'Gluten Free', value: 'GlutenFree', image: require('../../assets/dietary/GlutenFree.png') },
  { label: 'High Calorie', value: 'HighCalorie', image: require('../../assets/dietary/HighCalorie.png') },
  { label: 'High Fat', value: 'HighFat', image: require('../../assets/dietary/HighFat.png') },
  { label: 'High Protein', value: 'HighProtein', image: require('../../assets/dietary/HighProtein.png') },
  { label: 'High Sugar', value: 'HighSugar', image: require('../../assets/dietary/HighSugar.png') },
  { label: 'Lactose Free', value: 'LactoseFree', image: require('../../assets/dietary/LactoseFree.png') },
  { label: 'Low Calorie', value: 'LowCalorie', image: require('../../assets/dietary/LowCalorie.png') },
  { label: 'Low Fat', value: 'LowFat', image: require('../../assets/dietary/LowFat.png') },
  { label: 'Low Sugar', value: 'LowSugar', image: require('../../assets/dietary/LowSugar.png') },
  { label: 'Vegetarian', value: 'Vegetarian', image: require('../../assets/dietary/Vegetarian.png') },
];

const healthOptions = [
  { label: 'Diabetes', value: 'Diabetes', image: require('../../assets/health/Diabetes.png') },
  { label: 'Hypertension', value: 'Hypertension', image: require('../../assets/health/Hypertension.png') },
];

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weightKG, setWeightKG] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [heightCM, setHeightCM] = useState('');
  const [gender, setGender] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [healthConditions, setHealthConditions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState('dietary');

  const { data, isLoading, error, refetch } = useFetch('users', 'POST', {
    username,
    password,
    birthDate,
    weightKG: parseFloat(weightKG),
    goalWeight: parseFloat(goalWeight),
    heightCM: parseFloat(heightCM),
    gender,
    dietaryPreferences,
    healthConditions,
  });

  const handleSelect = (item) => {
    const selection = currentSelection === 'dietary' ? dietaryPreferences : healthConditions;
    const setter = currentSelection === 'dietary' ? setDietaryPreferences : setHealthConditions;

    if (selection.includes(item.value)) {
      setter(selection.filter((value) => value !== item.value));
    } else {
      setter([...selection, item.value]);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and password are required!');
      return;
    }

    try {
      await refetch();
      if (data.message === 'User created successfully') {
        Alert.alert('Registration Successful', 'You have registered successfully!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Registration Failed', 'Please check your input and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  const renderModalItem = ({ item }) => {
    const isSelected = currentSelection === 'dietary' ? dietaryPreferences.includes(item.value) : healthConditions.includes(item.value);
    return (
      <TouchableOpacity
        style={[styles.modalItem, isSelected ? { backgroundColor: '#ddd' } : {}]}
        onPress={() => handleSelect(item)}
      >
        <Image source={item.image} style={styles.modalImage} />
        <Text>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Register</Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Birth Date (YYYY-MM-DD)"
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TextInput
          placeholder="Weight (KG)"
          style={styles.input}
          value={weightKG}
          onChangeText={setWeightKG}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Goal Weight (KG)"
          style={styles.input}
          value={goalWeight}
          onChangeText={setGoalWeight}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Height (CM)"
          style={styles.input}
          value={heightCM}
          onChangeText={setHeightCM}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Prefer not to say" value="PreferNotToSay" />
        </Picker>
        <TextInput
          placeholder="Dietary Preferences"
          style={styles.input}
          value={dietaryPreferences.join(', ')}
          editable={false}
        />
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setCurrentSelection('dietary');
            setModalVisible(true);
          }}
        >
          <Text style={{ color: colors.backgroundWhite }}>Select Dietary Preferences</Text>
        </TouchableOpacity>
        <TextInput
          placeholder="Health Conditions"
          style={styles.input}
          value={healthConditions.join(', ')}
          editable={false}
        />
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => {
            setCurrentSelection('health');
            setModalVisible(true);
          }}
        >
          <Text style={{ color: colors.backgroundWhite }}>Select Health Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={currentSelection === 'dietary' ? dietaryOptions : healthOptions}
              renderItem={renderModalItem}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Register;
