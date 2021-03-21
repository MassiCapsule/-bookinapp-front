import React , {useState}  from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Avatar, Text} from 'react-native-elements';
import {connect} from 'react-redux';

function Category(props) {
    var categoryData = [
        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615893745/Roman_vtukbv.jpg", 
        categoryName:"Roman", 
        categoryAPI:"Fiction+/+Classics"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615893355/superheros2_bxs5sp.jpg", 
        categoryName:"Super Heros", 
        categoryAPI:"Comics+%26+Graphic+Novels+/+Superheroes"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615893544/fiction_h3mw80.jpg", 
        categoryName:"Fiction", 
        categoryAPI:"Juvenile+Fiction+/+General"},
    
        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615893451/manga_xtccau.jpg", 
        categoryName:"Manga", 
        categoryAPI:"Comics+%26+Graphic+Novels+/+Manga+/+For+boys"},
    
        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615893848/LoisirsCrea_uzpw6i.jpg", 
        categoryName:"Loisirs Créatifs", 
        categoryAPI:"CRAFTS+%26+HOBBIES"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615894628/cuisine_eaavpg.jpg", 
        categoryName:"Cuisine", 
        categoryAPI:"COOKING+%2F+General"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615894157/art_mithiz.jpg", 
        categoryName:"Art, Cinema, Musique", 
        categoryAPI:"ARTS+PHOTOGRAPHY+MUSIC"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615894935/React_bgobyc.jpg", 
        categoryName:"React", 
        categoryAPI:"React+javascript"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615894336/sport_dtfktv.jpg", 
        categoryName:"Sport", 
        categoryAPI:"SPORTS+%26+RECREATION"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615894521/Humour_zfwbfc.jpg", 
        categoryName:"Humour", 
        categoryAPI:"Humor+/+General"},

        {categoryImg:"https://res.cloudinary.com/dxdwluskm/image/upload/v1615894805/Droit_dnq9hl.jpg", 
        categoryName:"Droit", 
        categoryAPI:"Law"},
      ]

    function CatCut (desc) {
        if (desc.length > 12){
            return desc.substring(0,9)+"..."
          } else {
              return desc
          };
      };

    return (
        <View style={{paddingLeft:10, paddingBottom:40, paddingTop:10, flexDirection: "row"}}>
            {categoryData.map((item,i) => {
                return(
                    <TouchableOpacity key={i}
                        onPress={() => props.saveIDCatAPI(item.categoryAPI)}>
                                <View style={{paddingRight:5}}>
                                    <Avatar
                                    rounded
                                    source={{uri:(item.categoryImg)}}
                                    size="large"
                                    />
                                    <Text style={{color:'#23396c', textAlign:'center'}}>{CatCut(item.categoryName)}</Text>
                                </View>   
                    </TouchableOpacity>
                )
            })}
    </View>
        );
} 

function mapDispatchToProps(dispatch) {
    return {
      saveIDCatAPI: function(id) {
          dispatch( {type: 'saveCat', categoryAPI:id} )
      }
    }
   }

  
export default connect (null,mapDispatchToProps)(Category);


