export default function(googleId='', action) {
    if(action.type == 'saveGoogleId') {
      return action.googleId;
    } else {
      return googleId;
    }
}