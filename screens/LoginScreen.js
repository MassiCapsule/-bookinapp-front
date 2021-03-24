import React, {useState} from 'react';
import {View, StyleSheet, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import { Text, Button} from 'react-native-elements';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des composants
import Header from '../components/Header'

function Login (props) {
  const [ signInEmail, setSignInEmail ] = useState('');
  const [ signInPassword, setSignInPassword ] = useState('');
  const [ userMessage, setUserMessage ] = useState('');
  
  const navigation = useNavigation();

  /* On interroge le back sur la route sign-in avec l'email et le mot de passe */
  const handleSignInSubmit = async () => {
    const data = await fetch('https://whispering-eyrie-80583.herokuapp.com/sign-in', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `signInEmail=${signInEmail}&signInPassword=${signInPassword}`
    })

    const body = await data.json()

    /* Si retour du back = true (le compte exite) => On stocke le token dans le local storage et on renvoie sur la Home Page */
    if (body.login === true) {
      AsyncStorage.setItem('token', body.userToken);
      navigation.navigate('Explorer',{screen:'HomeScreen'});
      } else {
        /* Si retour false, on affiche le message d'erreur approprié */
        console.log('erreur')
        setUserMessage(body.message);
        }
  }       

return (
  <ScrollView>
    <View style={{backgroundColor:'#fafafa'}}>
      <Header/>

        <View >
          <Text style={styles.h1}>Se connecter sur Bookin</Text>
          <Text style={styles.intro}>En créant votre compte, vous pourrez trouver des idées de lectures et ajouter des livres à vos favoris</Text>
        </View>

        {/* Si message d'erreur, on l'affiche */}
        {userMessage ?                 
          <View style={{display:'flex', justifyContent:'center'}}>
            <Text style={styles.alert}>{userMessage}</Text>
          </View> : null }
        
        {/* Champs email */}
        <Text style={styles.nomChamps}>Email</Text>
          <TextInput 
            style={styles.champs} 
            type='email' 
            placeholder="Email" 
            onChangeText={(value)=> setSignInEmail(value)}
            value={signInEmail}>
          </TextInput>
        
        {/* Champs mot de passe */}
        <Text style={styles.nomChamps}>Mot de passe</Text>
          <TextInput 
            style={styles.champs} 
            type='password' 
            secureTextEntry={true} 
            placeholder="Mot de passe" 
            onChangeText={(value)=> setSignInPassword(value)}
            value={signInPassword}>
          </TextInput>      

        <Button buttonStyle={styles.button} titleStyle={{fontWeight:'bold'}} title ="JE ME CONNECTE" onPress={() => handleSignInSubmit()}/>

        <View>
          <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')}>
            <Text style={{display:'flex', textAlign:'center', textDecorationLine:'underline'}}>Vous n'avez pas encore de compte </Text> 
          </TouchableOpacity>
        </View>   

    </View>
  </ScrollView>
)}

export default Login;

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
