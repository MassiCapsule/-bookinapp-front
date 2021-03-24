import React , {useState, useEffect}  from 'react';
import {connect} from 'react-redux';
import {Alert, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Badge, Image, Text} from 'react-native-elements';
import { Ionicons} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Module pour gérer lire plus ou moins
import ReadMore from '@fawazahmed/react-native-read-more';

// Supprimer les caractères HTML de la description
var striptags = require('striptags');

function BookScreen(props) {
  const [dataBook, setDataBook] = useState ([]);
  const [dataBookAssociated, setDataBookAssociated] = useState ([]);
  const [isbn, setIsbn] = useState();
  const [like, setLike] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    /* Récupérer les informations du livre */
    const findBooks = async() => {
      const data = await fetch(`https://books.googleapis.com/books/v1/volumes/${props.googleId}`)
      const body = await data.json();

      /* Récupérer l'ISBN 13 du livre et non le 10 */
      if (body !== 0) {
        setDataBook(body.volumeInfo);

        /* Si un isbn est fourni par l'API alors on va filtre */
        if (body.volumeInfo.industryIdentifiers) {
          var isbnArray = body.volumeInfo.industryIdentifiers;

          var filteredIsbn = [];
            for (let i = 0; i < isbnArray.length; i++) {
              var sorted =   isbnArray.sort((a,b) => (a.type < b.type) ? 1 : ((b.type < a.type) ? -1 : 0));
                if (sorted[i].type === "ISBN_13") {
                  filteredIsbn.push(sorted[i].identifier);
                }
            };
            setIsbn(filteredIsbn);
        } else {
          setIsbn('nc')
        }

      } else {
        setDataBook([])
      };
      
      /* Récupérer les livres associés au livre cliqué */
      const assoc = await fetch(`https://books.googleapis.com/books/v1/volumes/${props.googleId}/associated`);
      const assocjson = await assoc.json();

      if (assocjson !== 0) {
        setDataBookAssociated(assocjson.items);
      } 

      /* Mettre à jour l'état like via la wishlist en BDD */
      AsyncStorage.getItem("token", function(error, token)
      {

        /* Checker si le livre est dans la wishList */
        if (token!==null) {
          var CheckWishList = async () => { 
            const data = await fetch(`https://whispering-eyrie-80583.herokuapp.com/checkwishlist`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded' },
            body: `token=${token}&bookid=${props.googleId}`
            });

            const checkWL = await data.json();
      
            /* Si le livre est dans la wishList mettre à jour l'état like*/
            if (checkWL.result === true) {
              setLike(true);
            } else {
              setLike(false);
            }

          };
          CheckWishList();
        } 
      })

  };
  findBooks()    
}, [])

// Rediriger vers la page livre
const handleClickBook = (id) => {
  navigation.navigate('BookScreen');
};

// Ajouter le livre à la WishList
const handleClickWLAdd = async () => {
  AsyncStorage.getItem("token", function(error, token)
  {
  if (token!==null) {
    var addWL = async () => {
      const data = await fetch('https://whispering-eyrie-80583.herokuapp.com/addtowishlist', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({"title":dataBook.title, "cover":dataBook.imageLinks.thumbnail, "bookid":props.googleId, "token":token})
      });

      const body = await data.json();
      console.log('body', body);

      // Mise à jour de l'état like si le livre est dans la wishlist et c'est à false
      if (body.result === true && like === false) {
        setLike(!like);
      }

      // Ajout de l'id du livre dans le store de la wishlist
      if (body.result === true && like === true) {
        props.addToWishList(props.googleId);
      }
        
    };
    addWL();

    /* Si pas de token, on renvie vers la création de compte */
    } else {
    Alert.alert('Attention', 'Vous devez vous connectez ou vous inscrire pour créer votre liste de favoris',[{text: 'Fermer'}],),
    navigation.navigate('CreateAccount');
    }
  });
};

// Supprimer le livre de la WishList
const handleClickWLDelete = async () => {
  AsyncStorage.getItem("token", function(error, token)
    { 
      if (token!==null) { 
        var deleteWL = async () => {
          const dataDelete = await fetch(`https://whispering-eyrie-80583.herokuapp.com/wishlist/delete/${token}/${props.googleId}`, {
          method: 'DELETE',
          });

          const bodyDelete = await dataDelete.json();
          console.log('bodyDelete', bodyDelete)

          /* Mettre à jour le statut de l'état Like */
          if (bodyDelete.result === true) {
            setLike(false);

            /* On recherche le livre dans la wishlist et on renvoie l'index du livre à supprimer dans le reduceur*/
            var index;
            for (let i =0; i <props.wishlist.length; i++) {
              if (props.wishlist[i].bookid === props.bookId) {
                index = i;
              }
            }
            props.deleteToWishList(props.googleId, index);
          }
        } 
      deleteWL ();
      }
    }
  );
}; 


// Récupération du tableau d'auteurs et les séparer par une virgule
var authors;
if (dataBook.authors) {
  if (dataBook.authors.length>1) {
    authors=dataBook.authors.join(', ');
  } else {
    authors=dataBook.authors;
  }
}

// Récupération de la catégorie principale du livre en la séparant par '/' et suppression des espaces
var style;
if (dataBook.categories) {
  if (dataBook.categories.length!=0) {
    style=dataBook.categories[0].split('/')[0].trim();
  } 
}

// Couper la longueur des titres
function CutTitle (desc) {
  if (desc.length > 12){
    return desc.substring(0,9)+"..."
  } else {
    return desc
    };
};

// Formater la date au format français
var date = new Date (dataBook.publishedDate).toLocaleDateString('fr-FR', { timeZone: 'UTC' });

return (
<View style={styles.viewG}>

  {/* Début Composant Header */}
  <View style={styles.viewH}>
    <TouchableOpacity onPress={() => props.navigation.navigate('HomeScreen')}>
      <View>
        <Ionicons name="chevron-back" size={30} color="black" />
      </View>
    </TouchableOpacity>

    <View>
      {like ? <Ionicons onPress={()=> handleClickWLDelete(dataBook.googleId)} name="heart-sharp" size={30} color="red" /> :
      <Ionicons onPress={()=> handleClickWLAdd()} name="heart-outline" size={30} color="red" />}
    </View>

  </View>
  {/* Fin Composant Header */}


  {/* Infos principales Livre */}     
  <View style={{marginBottom:10, display:'flex', flexDirection: "row"}}>

    {dataBook.imageLinks ? 
      <Image
        source= {{ uri: dataBook.imageLinks.thumbnail }}
        alt={dataBook.title}
        style={{ width: 107, height: 152, borderRadius:5 }}
        PlaceholderContent={<ActivityIndicator />}
      /> :
  
      <Image
        source={require('../assets/cover_nondispo.jpg')} 
        alt='cover bookin'
        style={{ width: 107, height: 152, borderRadius:5 }}
      />
    }
    

    <View style={{marginLeft:15}}>
      <Text style={styles.h2}>{dataBook.title}</Text>

      <Text style={styles.h3}>{authors}</Text>
      <View style={{display:'flex', flexDirection: "row", marginTop:10}}>
      <Ionicons name="md-star-sharp" size={20} color="#fca311" style={{paddingRight:1}}/>
      <Ionicons name="md-star-sharp" size={20} color="#fca311" style={{paddingRight:1}}/>
      <Ionicons name="md-star-sharp" size={20} color="#fca311" style={{paddingRight:1}}/>
      <Ionicons name="md-star-sharp" size={20} color="#fca311" style={{paddingRight:1}}/>
      <Ionicons name="md-star-outline" size={20} color="#fca311" style={{paddingRight:1}}/>
    </View>

    <View style={{display:'flex', flexDirection: "row"}}>
      <Text style={{color:'#fca311', fontWeight:'bold'}}>4</Text>
      <Text style={{color:'#464f57',}}> (30)</Text>
    </View>

    <View style={{marginTop:10, alignItems:'flex-start'}}>
      {dataBook.categories ? 
        <Badge
          value={style}
          badgeStyle={{ borderColor:'#23396c', backgroundColor:'#fafafa', padding:5, borderRadius:5}}
          textStyle={{color:'#23396c'}}
        />
      : null}
    </View>

    </View>
  </View>
  {/* Fin Infos principales Livre */}    

  {/* Infos Secondaires Livre */} 
  <ScrollView>    
    <View style={{paddingTop:20, paddingBottom:550}}> 

      <Text style={styles.h4}>DESCRIPTION</Text>
      {dataBook.description ? 
        <ReadMore numberOfLines={4} 
          style={styles.text} 
          seeMoreText={'Plus'}
          seeMoreStyle={{color:'#23396c', fontWeight:'bold'}}
          seeLessText={'Moins'}
          seeLessStyle={{color:'#23396c', fontWeight:'bold'}}
          animate={false}
        >
        
        {striptags(dataBook.description)}

        </ReadMore> : 

        <Text style={styles.text}>L'éditeur n'a pas transmis de description.</Text>
      }
      
      <Text style={styles.h4}>AUTEUR(S)</Text>
      <Text style={styles.text}>{authors}</Text>

      <Text style={styles.h4}>EDITEUR</Text>
      <Text style={styles.text}>{dataBook.publisher}</Text>

      <Text style={styles.h4}>DATE DE PUBLICATION</Text>
      <Text style={styles.text}>{date}</Text>

      <Text style={styles.h4}>NOMBRE DE PAGES</Text>
      <Text style={styles.text}>{dataBook.pageCount}</Text>

      <Text style={styles.h4}>ISBN</Text>
      <Text style={styles.text}>{isbn}</Text>

      {dataBookAssociated ? <Text style={styles.h2}>Nos recommandations</Text> : null}
      
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{flexDirection: "row", justifyContent:'space-between'}}>
          {dataBookAssociated ? dataBookAssociated.map((item,i) => 
            {
              return (
                <TouchableOpacity onPress={() => handleClickBook(props.googleId)}>
                  <View style={{paddingTop:10, paddingRight:5}} key={i}>
                    <Avatar 
                      rounded 
                      size="large"
                      source={{uri: item.volumeInfo.imageLinks.thumbnail}} />

                    <Text style={{color:'#464f57', textAlign:'center'}}>{CutTitle(item.volumeInfo.title)}</Text>
                  </View>
                </TouchableOpacity>
              ) 
            }
          ) : null}
        </View>
      </ScrollView>
  {/* Fin Infos Secondaires Livre */}   
    </View>
  </ScrollView>

</View>
 
);
}

/* Ajout dans le store Redux */
function mapDispatchToProps(dispatch) {
  return {
    addToWishList: function(bookId) {
     dispatch( {type: 'addToWishList', bookId:bookId} )
    }, 

    setWishlist: function (wishlist) {
     dispatch( {type: 'setWishlist', wishlist:wishlist} )
    }, 

    deleteToWishList: function(bookId, index) {
      dispatch( {type: 'DeleteToWishList', bookId:bookId, index:index} )
    },
  }
}

/* Récupération du store Redux */
function mapStateToProps(state) {
  return { googleId : state.idAPI, token: state.userToken, wishlist: state.wishlist }
 }

export default connect (mapStateToProps, mapDispatchToProps) (BookScreen);

/* Style CSS */
const styles = StyleSheet.create({
  viewG :{
    padding:15,
    backgroundColor:'#fafafa',
  },

  viewH:{
    marginTop:15, 
    marginBottom:15, 
    display:'flex', 
    flexDirection:'row', 
    justifyContent:'space-between'
  },

  h2: {
    color:'#23396c',
    fontSize: 18,
    fontWeight:'bold',
    paddingRight:100,
  },
     
  h3: {
    color:'#23396c',
    fontSize: 15,
  },

  h4: {
    color:'#23396c',
    fontSize: 15,
    fontWeight:'bold',
  },

  text: {
    color:'#464f57',
    fontSize: 15,
    marginBottom:15,
  },

});