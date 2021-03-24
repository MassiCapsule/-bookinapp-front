import React , {useState, useEffect}  from 'react';
import {connect} from 'react-redux';

import {Alert, StyleSheet, ScrollView, View} from 'react-native';
import {Button, Text} from 'react-native-elements';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des composants
import Header from '../components/Header'
import BookCard from '../components/BookCard'

function FavoriteScreen (props) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [displayWishlist, setDisplayWishlist] = useState(true);
  const [result, setResult] = useState([]);


useEffect(() => {
  AsyncStorage.getItem("token", function(error, token)
  {
    /* Récupération de la wishlist dans la BDD */
    if (token!==null) {
      var CheckWishList = async () => { 
        const data = await fetch(`https://whispering-eyrie-80583.herokuapp.com/getwishlist`, {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded' },
          body: `token=${token}`
        });

        const body = await data.json();

        /* Si on a un résultat et que la wishList n'est pas vide, on met à jour le store et on met à jour l'état setResult et setDisplay */
        if (body.result===true && body.wishlist.length > 0) {
          setDisplayWishlist(true);
          setResult(body.wishlist);
          props.setWishlist(body.wishlist);
        } 
        
        /* Si on a un résultat et que la wishList est vide, on met à jour le store et on met à jour l'état setResult et setDisplay */
        else if (body.result===true || body.wishlist.length === 0) {
          setDisplayWishlist(false);
          props.setWishlist(body.wishlist);
        }; 
      };
  
      CheckWishList();
    
    } else {
      Alert.alert('Attention', 'Vous devez vous connectez ou vous inscrire pour créer votre liste de favoris',[{text: 'Fermer'}],),
      navigation.navigate('Login');
      };
  })

},[isFocused])

/* On génére la bookCard avec les infos de la BDD */
var bookList = result.map((item,i) => {
  return (<BookCard key={i} bookTitle={item.title} googleId={item.bookid} bookCover={item.cover}/>)
});

 
  return (
    <View style={{backgroundColor:'#fafafa'}}>
      <Header/>
      <View>
        <Text style={styles.h3}>Vos favoris </Text>
          <ScrollView>
            {displayWishlist ? 
              <View style={styles.bookListView}>
                {bookList} 
              </View> :

              <View>
                <Text style={styles.alert}>Vous n'avez aucun livre dans votre wishlist</Text>
                <Button buttonStyle={styles.button} titleStyle={{fontWeight:'bold'}} title ="ME PROPOSER DES LIVRES" onPress={() => navigation.navigate('Explorer',{screen:'HomeScreen'})}/>
              </View>
            }
          </ScrollView>
      </View>
    </View>
  );
  }

/* Ajout dans le store Redux */
function mapDispatchToProps(dispatch) {
  return {
    setWishlist: function (wishlist) {
      dispatch( {type: 'setWishlist', wishlist:wishlist} )
    }, 
  }
};

/* Récupération du store Redux */
function mapStateToProps(state) {
  return { token: state.userToken, wishlist: state.wishlist}
}

export default connect (mapStateToProps, mapDispatchToProps) (FavoriteScreen);

/* Style CSS */
const styles = StyleSheet.create({
  bookListView: {
    display:'flex', 
    flexDirection: "row",
    justifyContent:'space-between',
    flexWrap: 'wrap', 
    padding:10,
    marginBottom:400,
  },


  h3: {
    color:'#23396c',
    fontSize: 20,
    paddingLeft:10,
    marginTop:20,
    marginBottom:5,
  },

  alert:{
    backgroundColor:'#f8d7da', 
    color:'#721c24',
    textAlign:'center', 
    marginTop:10, 
    padding:10, 
    marginRight:10, 
    marginLeft:10, 
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
});