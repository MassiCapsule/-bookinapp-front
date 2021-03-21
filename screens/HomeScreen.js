import React , {useState, useEffect}  from 'react';
import {connect} from 'react-redux';
import {StyleSheet, ScrollView, View, Text} from 'react-native';

// Import des composants
import BookCard from '../components/BookCard'
import Category from '../components/Category'
import Header from '../components/Header'

function HomeScreen(props) {
const [bookInfo, setBookInfo] = useState ([]);

useEffect(() => {
  /* Interrogation de l'API Google avec l'id de la catégorie récupéré du store */
  const findBooks = async() => {
    const data = await fetch(`https://books.googleapis.com/books/v1/volumes?q=${props.catAPI}&printType=books&maxResults=40&langRestrict=fr&orderBy=newest&fields=items(id,volumeInfo/title,volumeInfo/imageLinks),totalItems&apiKey=AIzaSyAIdljyRBhHojVGur6_xhEi1fdSKyb-rUE`);
    const body = await data.json();
      if (body.totalItems !== 0) {
      setBookInfo(body.items);
      } else {
        setBookInfo([])
      };
  };
  
  findBooks()    
}, [props.catAPI])

/* On map sur le tableau bookInfo pour générer la bookCard*/
var bookList = bookInfo.map((item,i) => {
  return (<BookCard key={i} bookTitle={!item.volumeInfo ? "Titre du livre": item.volumeInfo.title} googleId={item.id} bookCover={item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail}/>)
});

return (
  <View style={{backgroundColor:'#fafafa'}}>
    <Header/>
    <View>
      <Text style={styles.h2}>Catégories</Text>
    </View>

    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <Category/>
    </ScrollView >
    
  <Text style={styles.h3}>Bestsellers</Text>
    <ScrollView>
        <View style={styles.bookListView}>
            {bookList} 
        </View> 
    </ScrollView>
  </View>

);
}

/* Récupération du store Redux */
function mapStateToProps(state) {
  return { catAPI: state.catAPI }
}

export default connect (mapStateToProps, null) (HomeScreen);

/* Style CSS */
const styles = StyleSheet.create({
  view: {
    margin:10,
  },

  bookListView: {
    display:'flex', 
    flexDirection: "row",
    justifyContent:'space-between',
    flexWrap: 'wrap', 
    padding:10,
    paddingBottom:400,
  },

  h2: {
      color:'#23396c',
      fontSize: 20,
      paddingLeft:10,
      marginBottom:5,
    },


  h3: {
      color:'#23396c',
      fontSize: 20,
      paddingLeft:10,
      marginTop:20,
      marginBottom:5,
    },

});