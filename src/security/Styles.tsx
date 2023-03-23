import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  //Buttons
  button: {
    backgroundColor: '#17e9d7',
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    margin: 20,
  },
  buttonRegistry: {
    backgroundColor: 'yellow',
    borderWidth: 1,
    borderRadius: 12,
    margin: 70,
  },
  buttonForgot: {
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    width: '10%',
    margin: 10,
  },
  //Texts
  powered: {
    color: 'grey',
    textAlign: 'right',
    marginRight: 10,
    justifyContent: 'space-between',
    flexDirection: 'column',
    marginTop: '100%',
  },
  textForgotPassword: {
    textAlign: 'right',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginRight: 30,
  },
  textButton: {
    color: 'black',
    textAlign: 'center',
    height: 40,
    fontWeight: '800',
    fontSize: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    marginTop: '10%',
  },
  titleLogo: {
    fontSize: 32,
    textAlign: 'center',
    color: 'white',
    fontWeight: '700',
    marginTop: '10%',
  },
  //Inputs
  inputComplete: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputTextIcon: {
    borderColor: 'white',
    borderWidth: 1,
    borderTopEndRadius: 12,
    borderBottomEndRadius: 12,
    height: 50,
    width: 50,
    marginTop: 20,
    marginRight: 20,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    color: 'black',
  },
  inputIcon: {
    marginLeft: 20,
    marginTop: 20,
    width: 50,
    height: 50,
    textAlign: 'center',
    backgroundColor: 'white',
    paddingTop: 10,
  },
  inputIconBack: {
    marginLeft: 10,
    marginTop: 10,
    width: 70,
    height: 80,
    textAlign: 'center',
    paddingTop: 10,
  },
  //Views
  background: {
    backgroundColor: '#24253d',
    height: '100%',
    flex: 1,
  },
  bottom: {
    alignContent: 'flex-end',
  },
});
export {styles};
