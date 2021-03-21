export default function(categoryAPI='Fiction+/+Mystery+%26+Detective+/+General', action) {
    if(action.type == 'saveCat') {
      return action.categoryAPI;
    } else {
      return categoryAPI;
    }
}