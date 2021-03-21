import React, {useState} from 'react';
import {View, StyleSheet, TextInput, ScrollView, Alert, TouchableOpacity} from 'react-native';
import { Text, Button} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des composants
import Header from '../components/Header'

function CreateAccount (props) {
  const [ userLibraryName, setUserLibraryName ]= useState('');
  const [ userEmail, setUserEmail ]= useState('');
  const [ userPassword, setUserPassword] = useState('');
  const [ userMessage, setUserMessage ] = useState('');
  
  const navigation = useNavigation();

  /* Regex pour checker le format de l'e-mail */
  const checkEmailFormat = (email) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email ? emailRegex.test(String(email).toLowerCase()) : false;
  }

  const createUserAccount = async () => {
    /* Vérifie que l'e-mail répond à la regex */
    if (!checkEmailFormat(userEmail)) {
        setUserMessage('Veuillez saisir un email valide.');
    } else {
      const response = await fetch('http://192.168.0.42:3000/sign-up', {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: `libraryName=${userLibraryName}&email=${userEmail}&password=${userPassword}`
      });
          
      const dataResponse = await response.json();
      console.log(dataResponse)
    
      /* Si retour du back = false, on set la valeur du message à userMessage */
      if (dataResponse.result === false) {
        setUserMessage(dataResponse.message);
      }

      /* Si retour du back est OK, on récupère le token + renvoie vers la home + alert + vide les champs */
      if (dataResponse.result === true) {
        AsyncStorage.setItem('token', dataResponse.userToken);
        navigation.navigate('Explorer',{screen:'HomeScreen'});
        Alert.alert('Confirmation', 'Votre inscription a bien été validée',[{text: 'Fermer'}],),
        setUserEmail('');
        setUserLibraryName('');
        setUserPassword('');
        setUserMessage('');
      }
    }
  }

return (
  <ScrollView>
    <View style={{backgroundColor:'#fafafa'}}>
      <Header/>

        <View >
          <Text style={styles.h1}>S'inscrire sur Bookin</Text>
          <Text style={styles.intro}>En créant votre compte, vous pourrez trouver des idées de lectures et ajouter des livres à vos favoris</Text>
        </View>

        {/* Si message d'erreur, on l'affiche */}
        {userMessage ?                 
          <View style={{display:'flex', justifyContent:'center'}}>
            <Text style={styles.alert}>{userMessage}</Text>
          </View> : null }
        
        {/* Champs nom de la biliothèque */}
        <Text style={styles.nomChamps}>Nom de la bibliothèque</Text>
          <TextInput 
            style={styles.champs} 
            type='text' 
            placeholder="Nom de la bibliothèque" 
            onChangeText={(value) => setUserLibraryName(value)} 
            value={userLibraryName}>
          </TextInput>

          {/* Champs email */}
          <Text style={styles.nomChamps}>Email</Text>
            <TextInput 
              style={styles.champs} 
              type='email' 
              placeholder="Email" 
              onChangeText={(value)=> setUserEmail(value)}
              value={userEmail}>
            </TextInput>

          {/* Champs mot de passe */}
          <Text style={styles.nomChamps}>Mot de passe</Text>
            <TextInput 
              style={styles.champs} 
              type='password' 
              secureTextEntry={true} 
              placeholder="Mot de passe" 
              onChangeText={(value)=> setUserPassword(value)}
              value={userPassword}>
          </TextInput>      

          <Button buttonStyle={styles.button} titleStyle={{fontWeight:'bold'}} title ="JE M'INSCRIS" onPress={() => createUserAccount()}/>

          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{display:'flex', textAlign:'center', textDecorationLine:'underline'}}>Vous avez déjà un compte </Text> 
            </TouchableOpacity>
          </View>   

    </View>
  </ScrollView>
)}

export default CreateAccount;

const styles = StyleSheet.create({
  h1: {
      color:'#fca311',
      fontSize: 25,
      paddingLeft:10,
      marginBottom:0,
      marginTop:30,
      fontWeight:'bold',
    },

  intro: {
    marginRight:10,
    marginLeft:10,
    marginBottom:20,
    fontSize:15,
    color:'#464f57',
  },

  button: {
      marginTop:20,
      marginBottom:5,
      marginLeft:10,
      marginRight:10,
      padding:10,
      backgroundColor:'#23396c',
      color:'#23396c',
    },

  champs: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 5, 
    padding: 5,
    marginLeft:10,
    marginRight:10,
  },

  nomChamps: {
    paddingTop:15, 
    paddingBottom:5, 
    paddingLeft:10, 
    fontSize:18,
    fontWeight:'bold', 
    color:'#23396c' 
  },

  alert:{
    backgroundColor:'#f8d7da', 
    color:'#721c24',
    textAlign:'center', 
    marginTop:10, 
    padding:10, 
    marginRight:10, 
    marginLeft:10, 
  }

});
