export default function(wishList = [], action) {
    if(action.type === 'addToWishList'){
    var wishListCopy = [...wishList];     

    var findBook = false;
    for(let i=0;i<wishListCopy.length;i++){             
        if(wishListCopy[i].bookId === action.bookId){                 
            findBook = true             
        };         
    }          
        if(!findBook){             
            wishListCopy.push(action.bookId)         
        }                  
        return wishListCopy
    
    } else if (action.type === 'setWishlist') {
        return action.wishlist   

    } else {
        return wishList
    } 
}
